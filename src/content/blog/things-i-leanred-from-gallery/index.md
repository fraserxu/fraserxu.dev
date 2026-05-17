---
title: Things I learned from Gallery
date: '2020-04-21T22:12:03.284Z'
description: 'Notes'
---

## Repo: https://github.com/bendc/gallery

### CSS

- `object-fit`: https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
- `will-change`: https://developer.mozilla.org/en-US/docs/Web/CSS/will-change
- `--columns`: set css variable, `var(--columns)` use css variable
- `--size: calc((100vw - (var(--columns) + 1) * var(--gutter)) / var(--columns));`
- `scroll-snap-type: x mandatory;`
- `@media (prefers-color-scheme: dark) {}`: The prefers-color-scheme CSS media feature is used to detect if the user has requested the system use a light or dark color theme.

### HTML

- `type="module"`: Causes the code to be treated as a JavaScript module.
- `<template>`: The HTML Content Template (template) element is a mechanism for holding HTML that is not to be rendered immediately when a page is loaded but may be instantiated subsequently during runtime using JavaScript.

### JavaScript

- Web Animations API: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
