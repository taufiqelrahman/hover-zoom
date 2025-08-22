# HoverZoom – Lightweight Non-JQuery Plugin

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](./LICENSE)
[![Node Version](https://img.shields.io/badge/node-22.x-brightgreen)](https://nodejs.org/)
[![Build Status](https://img.shields.io/github/actions/workflow/status/taufiqelrahman/hoverzoom-js/ci.yml?branch=main)](https://github.com/taufiqelrahman/hoverzoom-js/actions)
[![Good First Issue](https://img.shields.io/badge/good%20first%20issue-friendly-brightgreen)](https://github.com/taufiqelrahman/hoverzoom-js/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22)

**HoverZoom** is a lightweight plugin built on **vanilla JavaScript** that allows users to zoom images on hover.  
No dependencies, no jQuery, fully optimized for minimal download size and fast performance.

[**Demo & Documentation**](https://hoverzoom-js.vercel.app)

---

## Features

- Lightweight, no additional javascript dependency. (5.4kB minified)
- No additional JavaScript dependency.
- Easy to install and use anywhere.
- Zoomed image can appear **inside** or **outside** the lens.
- Optional filters for the original image: blur, grayscale.

---

## Browser Compatibility

Tested in:

- Chrome 76+
- Firefox 69+
- Safari 12+
- Opera 63+

---

## Getting Started

### 1. CDN / Script Tag

Include the stylesheet in your `<head>`:

```html
<link rel="stylesheet" href="hoverzoom.css" />
```

Include the script before closing `<body>`:

```html
<script src="hoverzoom.js"></script>
```

Add the required HTML structure:

```html
<div class="hoverzoom">
  <img
    class="hoverzoom-image"
    src="required.jpg"
    data-large-image="optional-large.jpg"
    data-blur="true"
    data-grayscale="true"
    data-type="outside"
    data-position="right"
  />
</div>
```

Initialize with default or custom options:

```html
<link rel="stylesheet" href="node_modules/hoverzoom-js/style.css" />
<script src="node_modules/hoverzoom-js/dist/hoverzoom.umd.min.js"></script>
<script>
  const hoverZoom = new HoverZoom({
    position: "right", // 'right' | 'bottom' (only for type: 'outside')
    type: "outside", // 'outside' | 'inside'
    blur: true, // apply blur filter
    grayscale: true, // apply grayscale filter
  });
  hoverZoom.init();
</script>
```

---

### 2. Using HoverZoom with NPM / Module Bundlers

Install via NPM:

```bash
npm install hoverzoom-js
```

Import and initialize in your JavaScript/TypeScript project:

```js
// ES Module

// import JS
import HoverZoom from "hoverzoom-js";
// import CSS
import "hoverzoom-js/style.css";

const hoverZoom = new HoverZoom({
  position: "right",
  type: "outside",
  blur: true,
  grayscale: true,
});

// Initialize all elements with 'hoverzoom' class
hoverZoom.init();

// CommonJS
const HoverZoom = require("hoverzoom-js");
require("hoverzoom-js/style.css");

const hoverZoom = new HoverZoom();
hoverZoom.init();
```

---

## Options

| Option    | Type    | Default   | Description                                    |
| --------- | ------- | --------- | ---------------------------------------------- |
| position  | string  | "right"   | Position of the zoomed image (right or bottom) |
| type      | string  | "outside" | Magnifier type (inside or outside)             |
| blur      | boolean | false     | Apply blur filter to the original image        |
| grayscale | boolean | false     | Apply grayscale filter to the original image   |

---

## HTML Structure

```html
<div class="hoverzoom">
  <img
    class="hoverzoom-image"
    src="small.jpg"
    data-large-image="large.jpg"
    data-type="outside"
    data-position="right"
    data-blur="true"
    data-grayscale="false"
  />
</div>
```

---

## 🤝 Contributing

We ❤️ contributions!

- Check out good first issues here
- Fork the repo & create a branch:

```bash
git checkout -b feature/amazing-feature
```

- Commit & push your changes:

```bash
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

- Open a Pull Request to main.

### Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Keep code clean & formatted

⸻

## 📄 License

MIT License

## 🐛 Bug Reports & Feature Requests

Submit via [GitHub Issues](https://github.com/taufiqelrahman/hoverzoom-js/issues).

⸻

Made with ❤️ for building a lightweight plugin to zoom images on hover.
