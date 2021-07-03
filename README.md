### Nuxt fullpage

Nuxt module for creating fullscreen page scroll fast and simple.

- [Demo online](https://codesandbox.io/s/openafgnuxt-fullpage-live-demo-c8qul)


## Table of contents
1. [Installation](#installation)
2. [Usage](#usage)
3. [Options](#options)
4. [Contributing](#contributing)


## Installation

Terminal:
```bash
// With npm

npm install --save @openafg/nuxt-fullpage
```

## Usage

Add @openafg/nuxt-fullpage to the Modules section of nuxt.config.js

```js
export default {
  modules: [
    ['@openafg/nuxt-fullpage', {
      // Options
    }]
  ]
}
```

## Required HTML
This wrapper creates a `<full-page>` component, which you can use like other Vue.js components. For example:

```html
<div>
    <full-page>
      <section class="section">
        First section ...
      </section>
      <section class="section">
        Second section ...
      </section>
  </full-page>
</div>
```

## Options
To configure the module, in nuxt.config.js.

```js
export default {
  modules: [
    ['@openafg/nuxt-fullpage', {
      activeSection: 0,
      mouseWheelSensitivity: 120,
      showIndicators: false
    }]
  ]
}
```
## Contributing
