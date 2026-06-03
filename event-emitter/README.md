# Lightweight JavaScript Event Emitter

A beginner-friendly EventEmitter utility built with vanilla JavaScript. It allows modules to communicate using an event-driven publish/subscribe pattern.

---

## Features

- Register event listeners
- Emit events with arguments
- Remove specific listeners
- Support multiple listeners for the same event
- Register one-time listeners using `once()`
- View listeners for an event
- Clear listeners for one event or all events
- Handles unknown events safely
- Handles removing non-existing listeners safely
- Validates callback input
- No external libraries required

---

## Project Structure

```text
event-emitter/
├── EventEmitter.js
├── README.md
├── examples/
│   └── eventEmitterExample.js
└── tests/
    └── eventEmitter.test.js
```

---

## Basic Usage

```javascript
const EventEmitter = require('./EventEmitter');

const emitter = new EventEmitter();

emitter.on('message', (data) => {
  console.log(data);
});

emitter.emit('message', 'Hello World');
```

Output:

```text
Hello World
```

---

## Multiple Listeners

```javascript
emitter.on('login', () => {
  console.log('Listener 1');
});

emitter.on('login', () => {
  console.log('Listener 2');
});

emitter.emit('login');
```

Output:

```text
Listener 1
Listener 2
```

---

## Removing a Listener

```javascript
const callback = () => {
  console.log('Removed listener');
};

emitter.on('test', callback);
emitter.off('test', callback);
```

---

## One-Time Listener

```javascript
emitter.once('welcome', (name) => {
  console.log(`Welcome ${name}`);
});

emitter.emit('welcome', 'Naveen');
emitter.emit('welcome', 'Naveen');
```

The listener runs only once.

---

## Available Methods

### on(event, callback)

Registers a callback for an event.

### emit(event, ...args)

Runs all listeners attached to an event and passes arguments to them.

### off(event, callback)

Removes a specific callback from an event.

### once(event, callback)

Registers a callback that runs only one time.

### listeners(event)

Returns all listeners registered for an event.

### clear(event)

Clears listeners for a specific event. If no event is provided, all listeners are cleared.

---

## Edge Cases Handled

- Emitting an event with no listeners
- Removing a listener from an unknown event
- Removing a non-existing listener
- Multiple listeners on the same event
- One-time listeners
- Invalid callback input
- Clearing one event
- Clearing all events

---

## Testing

Run:

```bash
node event-emitter/tests/eventEmitter.test.js
```

---

## Example

Run:

```bash
node event-emitter/examples/eventEmitterExample.js
```

---

## Notes

- Uses JavaScript `Map` internally
- Built with vanilla JavaScript
- No external dependencies
- Beginner-friendly implementation