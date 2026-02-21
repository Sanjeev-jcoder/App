---
description: Revert the application theme to the original Purple Dark Mode
---

To revert the theme, follow these exact steps to update the CSS and HTML files back to their dark-mode state.

### Step 1: Restore CSS Variables in style.css
Replace the current `:root` in `style.css` with:
```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #f59e0b;
    --bg-dark: #0f172a;
    --card-bg: #1e293b;
    --text-main: #f8fafc;
    --text-muted: #94a3b8;
    --accent: #ec4899;
    --safe-area-bottom: 80px;
}
```

### Step 2: Revert Body and Global Container Backgrounds
In `style.css`:
1. Change `body { background-color: #f0f2f5; }` to `background-color: #000;`.
2. Change `#app-container { border: 8px solid #ffffff; }` to `border: 8px solid #334155;`.
3. Change `#auth-overlay { background: rgba(255, 255, 255, 0.95); }` to `background: rgba(15, 23, 42, 0.95);`.
4. Change `.bottom-nav { background: rgba(255, 255, 255, 0.9); }` to `background: rgba(30, 41, 59, 0.8);`.

### Step 3: Revert Category and Premium Banner Styles
In `style.css`:
1. Change `.cat-icon { background: #ffffff; border: 1px solid #e2e8f0; }` back to `background: var(--card-bg); border: 1px solid rgba(255, 255, 255, 0.05);`.
2. Change `.premium-promo { background: linear-gradient(135deg, #FF9933, #FFFFFF, #138808); color: #1e293b; }` back to `background: linear-gradient(135deg, var(--primary), var(--accent)); color: white; border: none;`.

### Step 4: Revert Editor Components in style.css
1. Change `.editor-panel { background: rgba(255, 255, 255, 0.9); border: 1px solid #e2e8f0; }` back to `background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.1);`.
2. Change `.btn-ghost { background: #ffffff; color: #1e293b; }` back to `background: transparent; color: white;`.

### Step 5: Update Backgrounds in index.html
1. In `#splash-screen`, revert the gradient and text colors for `H1` and `P`.
2. In `#text-panel`, change `background: #ffffff;` back to `rgba(15, 23, 41, 0.6);` and the textarea `color` back to `white`.
3. Revert the WhatsApp button background in `editor-footer` back to `#25D366`.
