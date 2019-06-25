const app = require('express')();
const http = require('http')
  .createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 3000;

http.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on *:${PORT}`);
});

io.on('connection', (client) => {
  console.log(`${getDateTime()} [${client.id}] client connected...`);

  client.on('message', (message, name, clientId = client.id) => {
    console.log(`< ${getDateTime()} [${clientId}] from [${name}]: ${message}`);
  });

  client.on('disconnect', () => {
    console.log(`${getDateTime()} [${client.id}] client disconnected...`);
  });

  client.on('error', (error) => {
    console.log(`${getDateTime()} [${client.id}] received error from client...`);
    console.log(error);
  });
});

function getDateTime () {
  const today = new Date();
  const date = `${today.getFullYear()}-${(today.getMonth() + 1)}-${today.getDate()}`;
  const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
  return `${date} ${time}`;
}
