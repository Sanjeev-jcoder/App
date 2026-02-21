---
description: Revert the application theme to the Gold & Midnight Luxury Aesthetic
---

To revert to the Gold & Midnight theme, apply these changes to the CSS and HTML files.

### Step 1: Update style.css Variables
Replace the current `:root` in `style.css` with:
```css
:root {
    --primary: #D4AF37; /* Metallic Gold */
    --primary-dark: #AA8439;
    --secondary: #AA8439;
    --bg-dark: #0a0a0a; /* Midnight Black */
    --card-bg: #1a1a1a; /* Matte Black */
    --text-main: #ffffff;
    --text-muted: #a0a0a0;
    --accent: #D4AF37;
    --safe-area-bottom: 80px;
}
```

### Step 2: Global Backgrounds in style.css
1. Change `body { background: linear-gradient(...); }` back to `background-color: #000;`.
2. Change `#app-container { border: 1px solid rgba(255,255,255,0.4); background: rgba(...); }` back to `border: 4px solid #1a1a1a; box-shadow: 0 0 50px rgba(212, 175, 55, 0.1);`.
3. Change `#auth-overlay { background: rgba(255, 255, 255, 0.3); }` to `rgba(10, 10, 10, 0.95);`.

### Step 3: Components in style.css
1. Change `.cat-icon { background: rgba(255, 255, 255, 0.4); }` to `background: #1a1a1a; border: 1px solid rgba(212, 175, 55, 0.1);`.
2. Change `.tool-btn { background: rgba(255, 255, 255, 0.5); }` to `#1a1a1a; border: 1px solid rgba(212, 175, 55, 0.05);`.

### Step 4: HTML Specifics in index.html
1. Revert `#splash-screen` to `background: #000;` and `H1` color to `#D4AF37`.
2. Change `.editor-footer` buttons back to the dark luxury style with gold icons.
3. Change `#text-panel` style back to `background: #1a1a1a;`.
