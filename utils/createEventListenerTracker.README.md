# createEventListenerTracker

A framework-independent helper that tracks event listeners you register through it, so you can inspect them, remove them, and clean them all up together (for example when a component unmounts).

It does not patch `addEventListener` / `removeEventListener` and does not scan the DOM. It only knows about listeners added via `add()`.

## Usage

```js
const createEventListenerTracker = require('./utils/createEventListenerTracker');

const tracker = createEventListenerTracker();

const handleClick = () => console.log('Clicked');

tracker.add(button, 'click', handleClick);
console.log(tracker.getActiveListeners().length); // 1

tracker.remove(button, 'click', handleClick);
console.log(tracker.getActiveListeners().length); // 0

tracker.add(window, 'resize', handleResize);
tracker.destroy(); // removes every tracked listener
```

## API

| Method | Returns | Notes |
| --- | --- | --- |
| `add(target, type, listener, options?)` | `boolean` | `true` when registered. `false` if the same target, type, listener and capture setting is already tracked. |
| `remove(target, type, listener, options?)` | `boolean` | `true` when a tracked listener was removed. `false` if it was never tracked through this tracker. |
| `getActiveListeners()` | `Array<{ target, type, listener, capture, options }>` | Snapshot of active entries. `options` is the caller's options, copied. |
| `getRemovedListeners()` | `Array<{ target, type, listener, capture, options }>` | Snapshot of the most recent 100 entries removed by `remove()` or `destroy()`. Older entries are dropped. |
| `destroy()` | `void` | Removes all tracked listeners. Safe to call more than once. After it runs, `add()` throws. |

## Validation

- `target` must have `addEventListener` and `removeEventListener`, otherwise `TypeError`.
- `type` must be a non-empty string, otherwise `TypeError`.
- `listener` must be a function or an object with `handleEvent`, otherwise `TypeError`.
- `options` must be a boolean, an object, `null`, or `undefined`, otherwise `TypeError`.
- `options` are passed to the native `addEventListener` unchanged. The tracker does not observe `once: true` listeners firing, so such an entry stays in `getActiveListeners()` until `remove()` or `destroy()` is called.
- `add()` after `destroy()` throws `Error`.
- If the native `addEventListener` throws, the error propagates and nothing is tracked.

## Capture

Listeners are identified by target, type, listener and capture. The capture value is `true` for a boolean `true` or an options object with `capture: true`. The same listener can therefore be registered once in the bubble phase and once in the capture phase.
