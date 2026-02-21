---
description: Revert the application theme to the Orange, White, and Green (Tiranga) Light Mode
---

To revert to the Tiranga theme, apply these changes to the CSS and HTML files.

### Step 1: Update style.css Variables
Replace the current `:root` in `style.css` with:
```css
:root {
    --primary: #FF9933; /* Saffron/Orange */
    --primary-dark: #e68a00;
    --secondary: #138808; /* Green */
    --bg-dark: #f0f2f5; 
    --card-bg: #ffffff;
    --text-main: #1e293b;
    --text-muted: #64748b;
    --accent: #FFFFFF;
    --safe-area-bottom: 80px;
}
```

### Step 2: Global Backgrounds in style.css
1. Change `body { background-color: #000; }` to `#f0f2f5;`.
2. Change `#app-container { border: 4px solid #1a1a1a; }` to `8px solid #ffffff;`.
3. Change `#auth-overlay { background: rgba(10, 10, 10, 0.95); }` to `rgba(255, 255, 255, 0.95);`.

### Step 3: Components in style.css
1. Change `.cat-icon { background: #1a1a1a; border: 1px solid rgba(212, 175, 55, 0.1); }` to `background: #ffffff; border: 1px solid #e2e8f0;`.
2. Change `.tool-btn { background: #1a1a1a; }` to `#ffffff;`.
3. Change `.editor-panel { background: rgba(26, 26, 26, 0.9); }` to `rgba(255, 255, 255, 0.9);`.

### Step 4: HTML Specifics in index.html
1. Revert `#splash-screen` to have no inline background and the `H1` color to `#FF9933`.
2. Revert `.editor-footer` button backgrounds.
3. Change `#text-panel` style back to `background: #ffffff;`.
