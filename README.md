# HoverZoom - Lightweight Non-JQuery Plugin

HoverZoom is a plugin built on javascript which allows users to zoom in images as they hover. This plugin doesn't depend on any other libraries and this doesn't use JQuery. This would cut a significant download time as this is built 100% using plain vanilla javascript.

<a href="https://demo-hoverzoom.taufiqelrahman.com/" target="_blank"><strong>Demo and documentation</strong></a>

## Features

* *Lightweight, no additional javascript dependency.
* Easy installation.
* Can be used anywhere.
* Zoomed in image can be inside or outside the lens.
* Filter options for original image.

## Browser Compatibility

Currently tested in:

* Chrome Version 76.0.3809.132
* Firefox Version 69.0.1
* Safari Version 12.1.1
* Opera Version 63.0.3368.94

## Getting Started

Include stylesheet in head tag:
```
<link rel="stylesheet" href="hoverzoom.css">
```

and script in body tag:
```
<script src="hoverzoom.js"></script>
```

Add "hoverzoom" classnames to your image:
```
<div class="hoverzoom">
  <img class="hoverzoom-image"
    src="required"
    data-large-image="optional"
    data-blur="optional"
    data-grayscale="optional"
    data-type="optional"
    data-position="optional"
  >
</div>
```

Add 1 line of javascript to initialize:
```
<script>
  new HoverZoom.init();
</script>
```

## Options

```
<script>
  new HoverZoom.init({
    position: 'left', // left / bottom (if type: outside)
    type: 'outside', // outside / inside
    blur: true, // adds blur filter
    grayscale: true, //adds grayscale filter
  });
</script>
```
