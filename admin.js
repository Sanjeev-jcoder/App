const DEFAULT_TEMPLATES = [
    {
        id: "default_1",
        name: 'Good Morning Sun',
        category: 'Good Morning',
        type: 'image',
        src: 'assets/good_morning.png',
        premium: false,
        frame: { x: 0.5, y: 0.42, r: 0.25, type: 'circle' }
    },
    {
        id: "default_2",
        name: 'Neon Motivation',
        category: 'Motivation',
        type: 'image',
        src: 'assets/motivation.png',
        premium: true,
        frame: { x: 0.28, y: 0.5, w: 0.35, h: 0.35, type: 'square' }
    },
    {
        id: "default_v1",
        name: 'Ocean Calm',
        category: 'Video',
        type: 'video',
        src: 'https://vjs.zencdn.net/v/oceans.mp4',
        premium: false,
        frame: { x: 0.5, y: 0.5, r: 0.2, type: 'circle' }
    },
    {
        id: "default_v2",
        name: 'Flower Bloom',
        category: 'Video',
        type: 'video',
        src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        premium: false,
        frame: { x: 0.5, y: 0.5, r: 0.25, type: 'circle' }
    }
];

let templates = [];

window.onload = () => {
    try {
        loadTemplates();
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    } catch (err) {
        console.error("Admin Init Error:", err);
    }
};

function loadTemplates() {
    try {
        const stored = localStorage.getItem('crafto_templates');
        if (stored) {
            const parsed = JSON.parse(stored);
            templates = Array.isArray(parsed) ? parsed : DEFAULT_TEMPLATES;

            // Migration: Only add defaults if that specific image path is missing
            let modified = false;
            DEFAULT_TEMPLATES.forEach(dt => {
                if (!templates.some(t => t.src === dt.src)) {
                    templates.push(dt);
                    modified = true;
                }
            });
            if (modified) saveToStorage();
        } else {
            templates = DEFAULT_TEMPLATES;
            saveToStorage();
        }
    } catch (e) {
        console.error("Error loading templates:", e);
        templates = DEFAULT_TEMPLATES;
    }
    renderAdminGrid();
}

function saveToStorage() {
    localStorage.setItem('crafto_templates', JSON.stringify(templates));
    document.getElementById('template-count').innerText = templates.length;
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

    // Normalize path: Remove all leading slashes (e.g. ///assets/ -> assets/)
    src = src.replace(/^\/+/, '');

    console.log("Validating path:", src);

    // Auto-fix extension common errors
    const isVideoFile = src.toLowerCase().endsWith('.mp4') || src.toLowerCase().endsWith('.webm');

    if (isVideoFile && type === 'image') {
        alert("⚠️ WAIT! This looks like a Video file (.mp4). Please change the 'Type' dropdown to 'Video Status' before publishing.");
        return;
    }

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
        id: "t_" + Date.now(),
        name: document.getElementById('t-name').value,
        category: document.getElementById('t-category').value,
        type: type,
        src: src,
        premium: document.getElementById('t-premium').value === 'true',
        date: document.getElementById('t-date').value,
        music: document.getElementById('t-music').value,
        text: document.getElementById('t-text').value,
        frame: frame
    };

    templates.push(newTemplate);
    saveToStorage();
    renderAdminGrid();
    e.target.reset();
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
    alert('✅ Template Published Successfully!');
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

function deleteTemplate(index) {
    if (confirm('Delete this template?')) {
        templates.splice(index, 1);
        saveToStorage();
        renderAdminGrid();
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
