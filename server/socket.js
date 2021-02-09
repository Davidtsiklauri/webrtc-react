const io = require('socket.io')();

class Socket {
  socket = null;
  users = new Map();
  constructor(app) {
    io.attach(app);
    this.socket = io;
  }

  getSocket(cb, getQueryCb) {
    this.socket.on('connection', (sock) => {
      this.users.set(sock.handshake.query, sock.handshake.query);
      this.emitSocketData('new_user', sock.handshake.query, sock);
      sock.emit('active_users', { data: this.users.values() });

      sock.on('answer', (data) => {
        cb(data, sock, sock.handshake.query, 'answer');
      });
      sock.on('offer', (data) => {
        cb(data, sock, sock.handshake.query, 'offer');
      });
      sock.on('active_users', (data) => {
        this.emitSocketData('active_users', this.users, sock);
      });
      sock.on('active_users', (data) => {
        this.emitSocketData('active_users', this.users, sock);
      });
      sock.on('disconnect', (data) => {
        const { id } = sock.handshake.query;
        this.emitSocketData('disconnect_user', id, sock);
        this.users.delete(id);
      });
    });
  }
  emitSocketData(event, data, socket, id) {
    socket.broadcast.emit(event, { [event]: data, id });
  }
}

module.exports = Socket;
