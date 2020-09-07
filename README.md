<h1 align="center">draggins</h1>
<h3 align="center">Make things draggable on mobile or desktop.</h3>
<p align="center">
  <a href="https://www.npmjs.com/package/draggins" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/draggins.svg">
  </a>
  <a href="https://github.com/TimoBechtel/draggins/blob/main/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/TimoBechtel/draggins" />
  </a>
</p>
<p align="center">
  ·
  <a href="https://github.com/TimoBechtel/draggins#readme">Homepage</a>
  ·
  <a href="https://timobechtel.github.io/draggins/">View Demo</a>
  ·
  <a href="https://github.com/TimoBechtel/draggins/issues">Report Bug / Request Feature</a>
  ·
</p>

## Table of Contents

- [Installation](#Install)
- [Usage](#usage)
- [Test](#run-tests)
- [Contact](#contact)
- [Contributing](#Contributing)
- [License](#license)

## Install

### NPM:

```sh
npm install draggins
```

### CDN:

```html
<script src="https://unpkg.com/draggins/dist/index.umd.js"></script>
```

## Usage

### As module:

```javascript
import { draggable } from 'draggins';
```

Then:

```javascript
draggable('.draggable');
```

You can use it easily with [Svelte](https://svelte.dev/):

```html
<script>
  import { draggable } from 'draggins';
  // discard return value as svelte expects its own api:
  const isDraggable = (el) => void draggable(el);
</script>
<div use:isDraggable>I'm draggable</div>
```

### More examples:

```javascript
const dragApi = draggable('.draggable', {
  onDragStart: (position) => console.log(position),
  onDragEnd: (position) => console.log(position),
});
document.getElementById('toggle').addEventListener('click', (e) => {
  dragApi.setDraggableState(e.target.checked);
});
```

Docs:

```typescript
/**
 * Make things draggable
 * @param element can be a range of different inputs, see https://github.com/CompactJS/uea
 * @param options draggable options
 * @returns returns api
 */
function draggable(
  element: string | HTMLElement | HTMLElement[] | HTMLCollection | NodeList,
  options?: DraggableOptions
): DraggableAPI;

interface DraggableAPI {
  /**
   * disable / enable dragging
   * @param state draggable
   */
  setDraggableState(state: boolean): void;
}

interface DraggableOptions {
  /**
   * limit dragging to a boundary box
   * set it to 'null' to disable
   * defaults to window width/height
   */
  limit?: { x: { min: number; max: number }; y: { min: number; max: number } };
  /**
   * stop dragging when mouse is out of boundaries
   * @default false
   */
  cancelWhenOutOfBoundary?: boolean;
  /**
   * draggins by default changes z-index to 99
   * @default false
   */
  dontTouchStyles?: boolean;

  /**
   * Run when dragging has started
   */
  onDragStart?: (position: { x: number; y: number }) => void;

  /**
   * Run when dragging has ended
   */
  onDragEnd?: (position: { x: number; y: number }) => void;
}
```

## Run tests

```sh
npm run test
```

## Contact

👤 **Timo Bechtel**

- Website: https://timobechtel.com
- Twitter: [@TimoBechtel](https://twitter.com/TimoBechtel)
- GitHub: [@TimoBechtel](https://github.com/TimoBechtel)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />

1. Check [issues](https://github.com/TimoBechtel/draggins/issues)
1. Fork the Project
1. Create your Feature Branch (`git checkout -b feat/AmazingFeature`)
1. Test your changes `npm run test`
1. Commit your Changes (`git commit -m 'feat: add amazingFeature'`)
1. Push to the Branch (`git push origin feat/AmazingFeature`)
1. Open a Pull Request

### Commit messages

This project uses semantic-release for automated release versions. So commits in this project follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) guidelines. I recommend using [commitizen](https://github.com/commitizen/cz-cli) for automated commit messages.

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Distributed under the [MIT](https://github.com/TimoBechtel/draggins/blob/main/LICENSE) License.

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
