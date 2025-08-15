# HoverZoom – Lightweight Non-JQuery Plugin

**HoverZoom** is a lightweight plugin built on **vanilla JavaScript** that allows users to zoom images on hover.  
No dependencies, no jQuery, fully optimized for minimal download size and fast performance.

[**Demo & Documentation**](https://hoverzoom-js.vercel.app)

___

## Features

- Lightweight, no additional javascript dependency. (5.4kB minified)
- No additional JavaScript dependency.
- Easy to install and use anywhere.
- Zoomed image can appear **inside** or **outside** the lens.
- Optional filters for the original image: blur, grayscale.

___

## Browser Compatibility

Tested in:

- Chrome 76+
- Firefox 69+
- Safari 12+
- Opera 63+

___

## Getting Started

### 1. CDN / Script Tag

Include the stylesheet in your `<head>`:

```html
<link rel="stylesheet" href="hoverzoom.css">
```

Include the script before closing `<body>`:

```html
<script src="hoverzoom.js"></script>
```

Add the required HTML structure:

```html
<div class="hoverzoom">
  <img class="hoverzoom-image"
       src="required.jpg"
       data-large-image="optional-large.jpg"
       data-blur="true"
       data-grayscale="true"
       data-type="outside"
       data-position="left"
  >
</div>
```

Initialize with default or custom options:

```html
<link rel="stylesheet" href="node_modules/hoverzoom-js/dist/hoverzoom.min.css">
<script src="node_modules/hoverzoom-js/dist/hoverzoom.umd.min.js"></script>
<script>
  const hoverZoom = new HoverZoom({
    position: 'left', // 'left' | 'bottom' (only for type: 'outside')
    type: 'outside',  // 'outside' | 'inside'
    blur: true,       // apply blur filter
    grayscale: true,  // apply grayscale filter
  });
  hoverZoom.init();
</script>
```

___

### 2. Using HoverZoom with NPM / Module Bundlers

Install via NPM:

```bash
npm install hoverzoom-js
```

Import and initialize in your JavaScript/TypeScript project:

```js
// ES Module

// import JS
import HoverZoom from 'hoverzoom-js';
// import CSS
import 'hoverzoom-js/dist/style.css';

const hoverZoom = new HoverZoom({
  position: 'left',
  type: 'outside',
  blur: true,
  grayscale: true,
});

// Initialize all elements with 'hoverzoom' class
hoverZoom.init();

// CommonJS
const HoverZoom = require('hoverzoom-js');
require('hoverzoom-js/dist/style.css')

const hoverZoom = new HoverZoom();
hoverZoom.init();
```

___

## Options

| Option     | Type      | Default   | Description                                        |
|------------|-----------|-----------|---------------------------------------------------|
| position   | string    | "left"    | Position of the zoomed image (left or bottom)    |
| type       | string    | "outside" | Magnifier type (inside or outside)               |
| blur       | boolean   | false     | Apply blur filter to the original image          |
| grayscale  | boolean   | false     | Apply grayscale filter to the original image    |


___

## HTML Structure

```html
<div class="hoverzoom">
  <img class="hoverzoom-image"
       src="small.jpg"
       data-large-image="large.jpg"
       data-type="outside"
       data-position="left"
       data-blur="true"
       data-grayscale="false"
  >
</div>
```


___

### License

MIT