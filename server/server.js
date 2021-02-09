const http = require('http'),
  Socket = require('./socket');

const app = http.createServer((req, res) => {
  const { url } = req;
  if (url === 'users') {
  }
  res.end();
  userRoute(req, res);
});

app.listen(5000, () => {
  console.log('init');
});

const socketInstance = new Socket(app);

socketInstance.getSocket(
  (data, sock, { id }, event) => {
    socketInstance.emitSocketData(event, data, sock, id);
  },
  (query) => {
    console.log(query);
  },
);
