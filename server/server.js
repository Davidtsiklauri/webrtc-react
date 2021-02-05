const http = require('http'),
  io = require('socket.io')(),
  Socket = require('./socket');

let app = http.createServer();

io.attach(app);

const socketInstance = new Socket(io);

socketInstance.getSocket((data, sock) => {
  socketInstance.emitSocketData('message', data, sock);
});

app.listen(5000, () => {
  console.log('init');
});
