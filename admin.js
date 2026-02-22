// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
    apiKey: "AIzaSyDqfN_aN5xA7b1HDNIIbRLIXhFmO2M7Qmk",
    authDomain: "whatsapp-status-8eddd.firebaseapp.com",
    projectId: "whatsapp-status-8eddd",
    storageBucket: "whatsapp-status-8eddd.firebasestorage.app",
    messagingSenderId: "903368195803",
    appId: "1:903368195803:web:1e03652603ec6905bc56fe",
    measurementId: "G-LZ9503W5S1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

let templates = [];

window.onload = () => {
    try {
        loadCloudTemplates();
        loadSubscriptionConfig();
        loadSubscribers();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (err) {
        console.error("Admin Init Error:", err);
    }
};

// --- Subscription Config ---
async function loadSubscriptionConfig() {
    try {
        const doc = await db.collection('config').doc('subscription').get();
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('sub-price').value = data.price || 0;
            document.getElementById('sub-upi').value = data.upiId || '';
            document.getElementById('sub-plan-name').value = data.planName || 'Crafto Pro';
            document.getElementById('sub-duration').value = data.duration || 'lifetime';
            document.getElementById('sub-merchant').value = data.merchantName || 'Crafto App';
        }
    } catch (e) {
        console.error('Error loading subscription config:', e);
    }
}

async function saveSubscriptionConfig() {
    const saveBtn = document.getElementById('save-sub-btn');
    const originalText = saveBtn ? saveBtn.innerText : "Save Subscription Settings";

    // 1. Gather Data
    const config = {
        price: parseInt(document.getElementById('sub-price').value) || 0,
        upiId: document.getElementById('sub-upi').value.trim(),
        planName: document.getElementById('sub-plan-name').value.trim(),
        duration: document.getElementById('sub-duration').value,
        merchantName: document.getElementById('sub-merchant').value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // 2. Local Validation
    if (config.price > 0 && !config.upiId) {
        alert('❌ Error: Please enter your UPI ID to receive payments of ₹' + config.price);
        return;
    }

    if (!saveBtn) {
        console.error("Critical: Save button not found via ID");
        return;
    }

    try {
        saveBtn.innerText = "⏳ Saving to Cloud...";
        saveBtn.disabled = true;

        console.log("Attempting to save config:", config);

        // 3. Create a promise that times out after 10 seconds
        const savePromise = db.collection('config').doc('subscription').set(config, { merge: true });

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("Request timed out (10s). Check your internet connection or Firebase permissions.")), 10000);
        });

        // 4. Race the save against the timeout
        await Promise.race([savePromise, timeoutPromise]);

        const statusEl = document.getElementById('sub-config-status');
        const msg = config.price === 0
            ? '✅ SUCCESS: App is now FREE for all users!'
            : `✅ SUCCESS: Users will now be charged ₹${config.price} via UPI ID ${config.upiId}`;

        if (statusEl) {
            statusEl.innerText = msg;
            statusEl.style.color = '#10B981';
        }

        alert(msg);
        console.log("Config saved successfully");

    } catch (e) {
        console.error("Save failure:", e);
        alert('❌ FAIED TO SAVE: ' + e.message);
    } finally {
        if (saveBtn) {
            saveBtn.innerText = originalText;
            saveBtn.disabled = false;
        }
    }
}

// --- Subscriber Management ---
function loadSubscribers() {
    // Pending subscribers
    db.collection('subscriptions').where('status', '==', 'pending').onSnapshot(snap => {
        const container = document.getElementById('pending-subs');
        if (snap.empty) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No pending payments</p>';
            return;
        }
        container.innerHTML = '';
        snap.docs.forEach(doc => {
            const s = doc.data();
            const div = document.createElement('div');
            div.style.cssText = 'background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';
            div.innerHTML = `
                <div>
                    <strong style="color: #f59e0b;">${s.phone || 'Unknown'}</strong>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">UTR: ${s.transactionId || 'N/A'} | ₹${s.amount || 0}</p>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">${s.createdAt ? new Date(s.createdAt.seconds * 1000).toLocaleString() : ''}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-primary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="approveSubscription('${doc.id}')">✅ Approve</button>
                    <button class="btn-ghost" style="padding: 8px 16px; font-size: 0.8rem; color: #ef4444;" onclick="rejectSubscription('${doc.id}')">❌ Reject</button>
                </div>
            `;
            container.appendChild(div);
        });
    });

    // Active subscribers
    db.collection('subscriptions').where('status', '==', 'active').onSnapshot(snap => {
        const container = document.getElementById('active-subs');
        if (snap.empty) {
            container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No active subscribers yet</p>';
            return;
        }
        container.innerHTML = '';
        snap.docs.forEach(doc => {
            const s = doc.data();
            const div = document.createElement('div');
            div.style.cssText = 'background: rgba(52,211,153,0.1); border: 1px solid rgba(52,211,153,0.3); border-radius: 12px; padding: 15px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';
            div.innerHTML = `
                <div>
                    <strong style="color: #34D399;">${s.phone || 'Unknown'}</strong>
                    <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">Plan: ${s.planName || 'Pro'} | ₹${s.amount || 0}</p>
                    <p style="font-size: 0.7rem; color: var(--text-muted);">Approved: ${s.approvedAt ? new Date(s.approvedAt.seconds * 1000).toLocaleString() : 'N/A'}</p>
                </div>
                <button class="btn-ghost" style="padding: 8px 16px; font-size: 0.75rem; color: #ef4444;" onclick="revokeSubscription('${doc.id}')">Revoke</button>
            `;
            container.appendChild(div);
        });
    });
}

async function approveSubscription(docId) {
    if (confirm('Approve this payment? The user will be able to share/download.')) {
        await db.collection('subscriptions').doc(docId).update({
            status: 'active',
            approvedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('✅ Subscription activated!');
    }
}

async function rejectSubscription(docId) {
    if (confirm('Reject this payment?')) {
        await db.collection('subscriptions').doc(docId).update({
            status: 'rejected'
        });
        alert('❌ Payment rejected.');
    }
}

async function revokeSubscription(docId) {
    if (confirm('Revoke this subscription? User will lose access.')) {
        await db.collection('subscriptions').doc(docId).update({
            status: 'revoked'
        });
        alert('Subscription revoked.');
    }
}

function loadCloudTemplates() {
    db.collection('templates').onSnapshot((snapshot) => {
        templates = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        document.getElementById('template-count').innerText = templates.length;
        renderAdminGrid();
    });
}

function renderAdminGrid() {
    const grid = document.getElementById('admin-template-grid');
    grid.innerHTML = '';

    templates.forEach((t, index) => {
        const item = document.createElement('div');
        item.className = 'admin-template-item';
        item.innerHTML = `
            <button class="delete-btn" onclick="deleteTemplate(${index})">
                <i data-lucide="trash-2" style="width:16px; height:16px;"></i>
            </button>
            <img src="${t.src}" onerror="this.src='https://via.placeholder.com/300?text=No+Asset'">
            <div class="item-info">
                <div style="display:flex; gap:5px; margin-bottom: 8px;">
                    <span class="badge ${t.type}">${t.type}</span>
                    ${t.premium ? '<span class="badge premium">Premium</span>' : ''}
                </div>
                <h4 style="font-size: 0.9rem; font-weight: 600;">${t.name}</h4>
                <p style="font-size: 0.75rem; color: var(--text-muted);">${t.category}</p>
            </div>
        `;
        grid.appendChild(item);
    });
    lucide.createIcons();
}

function toggleTypeFields() {
    const type = document.getElementById('t-type').value;
    document.getElementById('video-fields').style.display = (type === 'video') ? 'block' : 'none';
    document.getElementById('text-fields').style.display = (type === 'text') ? 'block' : 'none';
}

async function handleFormSubmit(e) {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerText;
    const type = document.getElementById('t-type').value;
    let src = document.getElementById('t-asset').value.trim();

    // Normalize path: Remove all leading slashes
    src = src.replace(/^\/+/, '');

    // Validate if file exists
    if (type === 'image') {
        submitBtn.innerText = "⏳ Validating Image...";
        submitBtn.disabled = true;
        try {
            await validateImage(src);
        } catch (err) {
            handleValidationError(src, originalBtnText, submitBtn);
            return;
        }
    } else if (type === 'video') {
        submitBtn.innerText = "⏳ Validating Video...";
        submitBtn.disabled = true;
        try {
            await validateVideo(src);
        } catch (err) {
            handleValidationError(src, originalBtnText, submitBtn);
            return;
        }
    }

    let frame;
    let frameRaw = document.getElementById('t-frame').value.trim();

    // Forgiveness logic: Convert single quotes to double quotes for valid JSON
    if (frameRaw.includes("'")) {
        frameRaw = frameRaw.replace(/'/g, '"');
    }

    try {
        frame = JSON.parse(frameRaw);
    } catch (e) {
        alert("❌ ERROR: Invalid JSON in Frame Configuration.\n\nJSON must use double quotes like this:\n{\"x\": 0.5, \"y\": 0.5, \"r\": 0.25, \"type\": \"circle\"}");
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
        return;
    }

    const newTemplate = {
        name: document.getElementById('t-name').value,
        category: document.getElementById('t-category').value,
        type: type,
        src: src,
        premium: document.getElementById('t-premium').value === 'true',
        date: document.getElementById('t-date').value,
        music: document.getElementById('t-music').value,
        text: document.getElementById('t-text').value,
        frame: frame,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('templates').add(newTemplate);

    e.target.reset();
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
    alert('✅ Template Published to Cloud Successfully!');
}

function handleValidationError(src, originalBtnText, submitBtn) {
    let errorMsg = `❌ ERROR: Could not load the file at "${src}".\n\nPlease ensure the file exists in the assets folder.`;
    if (src.toLowerCase().startsWith('c:') || src.toLowerCase().startsWith('file:')) {
        errorMsg = "❌ SECURITY ERROR: Browsers block direct access to local files (C:/). \n\nPlease move your file to the 'assets' folder and use a path like: assets/your-file.mp4";
    }
    alert(errorMsg);
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
}

function validateImage(url) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            img.onload = img.onerror = null;
            reject("Timeout");
        }, 5000);
        const img = new Image();
        img.onload = () => { clearTimeout(timeout); resolve(); };
        img.onerror = () => { clearTimeout(timeout); reject(); };
        img.src = url;
    });
}

function validateVideo(url) {
    return new Promise((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';
        const timeout = setTimeout(() => {
            video.onloadedmetadata = video.onerror = null;
            reject("Timeout");
        }, 8000); // Videos can take longer to handshake
        video.onloadedmetadata = () => { clearTimeout(timeout); resolve(); };
        video.onerror = () => { clearTimeout(timeout); reject(); };
        video.src = url;
    });
}

async function deleteTemplate(index) {
    const templateId = templates[index].id;
    if (confirm('Delete this template from Cloud permanently?')) {
        await db.collection('templates').doc(templateId).delete();
        alert('🗑️ Template deleted from Cloud.');
    }
}

function resetApp() {
    if (confirm('Verify: Reset to default factory templates?')) {
        localStorage.removeItem('crafto_templates');
        location.reload();
    }
}

function exportData() {
    const data = JSON.stringify(templates, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crafto-db-export.json';
    a.click();
}
