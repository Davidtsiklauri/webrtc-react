const http = require('http'),
     io = require('socket.io')(4000),
     Socket = require('./socket');

let app = http.createServer((req, res) => {
    const socketInstance = new Socket(io);
    
});

app.listen(4000, '127.0.0.1');