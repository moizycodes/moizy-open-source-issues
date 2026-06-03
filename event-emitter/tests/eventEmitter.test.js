const EventEmitter = require('../EventEmitter');

const emitter = new EventEmitter();

emitter.on('message', (data) => {
  console.log(data);
});

emitter.emit('message', 'Hello World');

const listenerOne = () => {
  console.log('Listener 1');
};

const listenerTwo = () => {
  console.log('Listener 2');
};

emitter.on('login', listenerOne);
emitter.on('login', listenerTwo);

emitter.emit('login');

emitter.off('login', listenerOne);

emitter.emit('login');

emitter.once('onlyOnce', () => {
  console.log('Runs once');
});

emitter.emit('onlyOnce');
emitter.emit('onlyOnce');

console.log(emitter.listeners('login').length);

emitter.emit('unknown-event');

emitter.clear('login');

console.log(emitter.listeners('login').length);

emitter.clear();

console.log(emitter.listeners('message').length);