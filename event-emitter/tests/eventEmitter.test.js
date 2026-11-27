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

test('EventEmitter rejects listeners and middleware that are not functions', () => {
  const emitter = new EventEmitter();

  assert.throws(() => emitter.on('message', 'not a function'), TypeError);
  assert.throws(() => emitter.once('message', null), TypeError);
  assert.throws(() => emitter.use({}), TypeError);
});

test('EventEmitter runs middleware before listeners, in the order it was added', () => {
  const emitter = new EventEmitter();
  const order = [];

  emitter.use((event, args, next) => {
    order.push(`first:${event}`);
    next();
  });
  emitter.use((event, args, next) => {
    order.push(`second:${event}`);
    next();
  });
  emitter.on('message', () => order.push('listener'));

  emitter.emit('message');

  assert.deepEqual(order, ['first:message', 'second:message', 'listener']);
});

test('EventEmitter middleware can replace the arguments listeners receive', (t) => {
  const emitter = new EventEmitter();
  const listener = t.mock.fn();

  emitter.use((event, args, next) => next(args.map((arg) => arg.toUpperCase())));
  emitter.on('message', listener);
  emitter.emit('message', 'hello', 'world');

  assert.deepEqual(listener.mock.calls[0].arguments, ['HELLO', 'WORLD']);
});

test('EventEmitter middleware stops an event by not calling next', (t) => {
  const emitter = new EventEmitter();
  const listener = t.mock.fn();
  const laterMiddleware = t.mock.fn();

  emitter.use((event, args, next) => {
    if (event !== 'blocked') next();
  });
  emitter.use(laterMiddleware);
  emitter.on('blocked', listener);
  emitter.emit('blocked');

  assert.equal(laterMiddleware.mock.callCount(), 0);
  assert.equal(listener.mock.callCount(), 0);
});

test('EventEmitter middleware runs for events that have no listeners', (t) => {
  const emitter = new EventEmitter();
  const middleware = t.mock.fn((event, args, next) => next());

  emitter.use(middleware);
  emitter.emit('unknown-event', 1);

  assert.equal(middleware.mock.callCount(), 1);
  assert.deepEqual(middleware.mock.calls[0].arguments.slice(0, 2), ['unknown-event', [1]]);
});

test('EventEmitter.use returns a function that removes the middleware', (t) => {
  const emitter = new EventEmitter();
  const middleware = t.mock.fn((event, args, next) => next());
  const listener = t.mock.fn();

  const remove = emitter.use(middleware);
  emitter.on('message', listener);
  remove();
  emitter.emit('message');

  assert.equal(middleware.mock.callCount(), 0);
  assert.equal(listener.mock.callCount(), 1);
});
