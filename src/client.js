const io = require('socket.io-client');
const readline = require('readline');

const URI = process.env.URI || 'http://localhost:3000';
const rl = getReadlineInterface();
let socket;

promptHandler();

function getReadlineInterface () {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

function promptHandler () {
  askName()
    .then((name) => {
      console.log(`Welcome, ${name}!`);
      return name;
    })
    .then((name) => {
      socketHandler(name);
      return name;
    })
    .then((name) => {
      setPrompt(name);
      rl.on('line', (line) => {
        if (line === 'exit') {
          rl.close();
        }
        sendMessage(line.trim(), name);
        rl.prompt();
      });
      rl.on('close', () => {
        console.log('Good buy! See you later ^_^');
        process.exit(0);
      });
    });
}

function askName () {
  return new Promise((resolve) => {
    rl.question('Enter your name: ', (name) => resolve(name));
  });
}

function setPrompt (name) {
  rl.setPrompt(`> [${name}]: `);
}

function clearPrompt () {
  rl.setPrompt('');
}

function socketHandler (name) {
  socket = io.connect(URI);

  socket.on('connect', () => {
    console.log(`\nconnected to the server session [${socket.id}] as [${name}]`);
    setPrompt(name);
    rl.prompt();

    socket.on('disconnect', () => {
      clearPrompt();
      console.log('\ndisconnected from the server session');
    });

    socket.on('message', (message) => {
      console.log(`\n> [${socket.id}]: ${message}`);
    });
  });
}

function sendMessage (message, name) {
  socket.emit('message', message, name);
}
