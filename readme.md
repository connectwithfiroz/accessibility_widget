# ♿ Web Accessibility Engine & Widget

> A lightweight, zero-backend, client-side accessibility widget designed to improve website usability, visual comfort, and WCAG compliance with drop-in installation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#contributing)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)](#tech-stack)

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Quick Start & Integration](#-quick-start--integration)
- [File Architecture](#-file-architecture)
- [Customization & Configuration](#-customization--configuration)
- [Tech Stack](#-tech-stack)
- [License](#-license)
- [Author & Credits](#-author--credits)

---

## 🧐 Overview

This accessibility engine provides website visitors with an interactive toolkit to adapt page styles dynamically to their visual and physical needs. 

It runs **entirely on the client side** without needing a backend server or token authentication setup. Simply include the static CSS and JavaScript files in any project (plain HTML, PHP, Laravel, React, or WordPress), and the engine handles auto-initialization and dragging functionality automatically.

---

## ✨ Key Features

- 🚀 **Zero Backend Required:** Instant integration using static HTML, CSS, and JS.
- 🖐️ **Draggable Interface:** Smooth dynamic repositioning using custom ES6 module handlers.
- 🎨 **Visual Adjustments:** Contrast toggles, text scaling, element highlighting, and screen-reading/focus tools.
- ⚡ **Lightweight & Fast:** Pure vanilla JavaScript execution with zero external runtime overhead.
- 🔒 **Self-Contained Styling:** Modular CSS structure prevents global style leaks onto the target host site.

---

## 🚀 Quick Start & Integration

Add the required stylesheet inside your `<head>` tag and script modules right before the closing `</body>` tag of your application.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Web Page</title>

    <!-- 1. Accessibility Widget Stylesheet (Required) -->
    <link rel="stylesheet" href="v4/public/accessibility/css/accessibility-style.css" />
  </head>
  <body>
    <div id="accessabilityBtnSection"></div>

    <!-- Your regular page content goes here -->

    <!-- 2. Core Accessibility Engine -->
    <script src="v4/public/accessibility/js/accessibility.min.js"></script>

    <!-- 3. Widget Configuration & Auto-Initialization -->
    <script class="erasableJsSrc" src="v4/public/accessibility_config.js"></script>

    <!-- 4. Draggable Module -->
    <script class="erasableJsSrc" type="module" src="v4/public/draggable/draggable.js"></script>
  </body>
</html>