const test = require('node:test');
const assert = require('node:assert/strict');

const EventEmitter = require('../EventEmitter');

test('EventEmitter calls a listener with the emitted arguments', (t) => {
  const emitter = new EventEmitter();
  const listener = t.mock.fn();

  emitter.on('message', listener);
  emitter.emit('message', 'Hello World', 42);

  assert.equal(listener.mock.callCount(), 1);
  assert.deepEqual(listener.mock.calls[0].arguments, ['Hello World', 42]);
});

test('EventEmitter calls every listener registered for an event', (t) => {
  const emitter = new EventEmitter();
  const listenerOne = t.mock.fn();
  const listenerTwo = t.mock.fn();

  emitter.on('login', listenerOne);
  emitter.on('login', listenerTwo);
  emitter.emit('login');

  assert.equal(listenerOne.mock.callCount(), 1);
  assert.equal(listenerTwo.mock.callCount(), 1);
});

test('EventEmitter.off removes only the given listener', (t) => {
  const emitter = new EventEmitter();
  const listenerOne = t.mock.fn();
  const listenerTwo = t.mock.fn();

  emitter.on('login', listenerOne);
  emitter.on('login', listenerTwo);
  emitter.off('login', listenerOne);
  emitter.emit('login');

  assert.equal(listenerOne.mock.callCount(), 0);
  assert.equal(listenerTwo.mock.callCount(), 1);
  assert.equal(emitter.listeners('login').length, 1);
});

test('EventEmitter.once runs a listener a single time', (t) => {
  const emitter = new EventEmitter();
  const listener = t.mock.fn();

  emitter.once('onlyOnce', listener);
  emitter.emit('onlyOnce');
  emitter.emit('onlyOnce');

  assert.equal(listener.mock.callCount(), 1);
});

test('EventEmitter ignores events that have no listeners', () => {
  const emitter = new EventEmitter();

  assert.doesNotThrow(() => emitter.emit('unknown-event'));
  assert.equal(emitter.listeners('unknown-event').length, 0);
});

test('EventEmitter.clear removes the listeners of one event or of all events', (t) => {
  const emitter = new EventEmitter();
  emitter.on('message', t.mock.fn());
  emitter.on('login', t.mock.fn());

  emitter.clear('login');

  assert.equal(emitter.listeners('login').length, 0);
  assert.equal(emitter.listeners('message').length, 1);

  emitter.clear();

  assert.equal(emitter.listeners('message').length, 0);
});
