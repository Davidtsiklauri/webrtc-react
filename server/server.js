const http = require('http'),
     io = require('socket.io')(),
     Socket = require('./socket');

let app = http.createServer();
io.attach(app);

const socketInstance = new Socket(io);

app.listen(5000, () => {
    console.log('init')
}); 