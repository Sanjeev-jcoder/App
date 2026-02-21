# Change Documentation & Reversion Guide

This document tracks the major changes made to the Crafto Status Maker app during this session and provides instructions for reverting to previous states.

## 1. AI Background Removal (REVERTED)
- **Status**: **FULLY REVERTED**.

## 2. Main Layout (REVERTED TO PREVIOUS)
- **Status**: **REVERTED**. Restored original horizontal **Category Slider**.

## 3. Theme Overhaul: Orange-White-Green
- **Status**: **REPLACED**.

## 4. Theme Overhaul: Gold & Midnight
- **Status**: **REPLACED**.

## 5. Theme Overhaul: Glassmorphism (CURRENT)
- **Changes**: 
    - Applied **Sky Blue** (`#60A5FA`) as primary color.
    - Switched to a **Light Mode** aesthetic with high-transparency backgrounds.
    - Added heavy **backdrop-filter: blur(25px)** to all panels and overlays.
    - Updated borders to thin semi-transparent white lines.
    - Themed the Splash Screen with a soft blue gradient and "MODERN STATUS" subhead.
    - Updated WhatsApp button to a frosted emerald green.

---

## How to Revert to Previous Versions

### To Revert to the "Gold & Midnight" Theme
A specific workflow has been created to handle the Gold reversion:
`/.agent/workflows/revert-to-gold.md`

### To Revert to the "Tiranga" Theme (Orange/White/Green)
Workflow: `/.agent/workflows/revert-to-tiranga.md`

### To Revert to the "Original Purple" Theme
Workflow: `/.agent/workflows/revert-theme.md`
