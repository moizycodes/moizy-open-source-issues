const EventEmitter = require('../EventEmitter');

const emitter = new EventEmitter();

emitter.on('message', (data) => {
  console.log(data);
});

emitter.emit('message', 'Hello World');

const loginListenerOne = () => {
  console.log('Listener 1');
};

const loginListenerTwo = () => {
  console.log('Listener 2');
};

emitter.on('login', loginListenerOne);
emitter.on('login', loginListenerTwo);

emitter.emit('login');

emitter.once('welcome', (name) => {
  console.log(`Welcome ${name}`);
});

emitter.emit('welcome', 'Naveen');
emitter.emit('welcome', 'Naveen');