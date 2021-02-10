const io = require('socket.io')(),
  USER_TAGS = require('./data/tags'),
  UTILS = require('./utils/utils');

class Socket {
  socket = null;
  usersMap = new Map();
  utils;
  constructor(app) {
    io.attach(app);
    this.socket = io;
    this.utils = new UTILS();
  }

  getSocket(cb) {
    this.socket.on('connection', (sock) => {
      const { id } = sock.handshake.query;
      const { address } = sock.handshake;

      const randomIndex = this.utils.getRandomNumber(USER_TAGS.length);
      const randTag = this.utils.getRandomByArrayIndex(USER_TAGS, randomIndex);

      this.usersMap.set(id, { id, tag: randTag, address: address });

      this.emitSocketData('new_user', this.usersMap.get(id), sock);

      sock.emit('active_users', Array.from(this.usersMap.values()));

      sock.on('answer', (data) => {
        cb(data, sock, sock.handshake.query, 'answer');
      });
      sock.on('offer', (data) => {
        cb(data, sock, sock.handshake.query, 'offer');
      });

      sock.on('disconnect', (data) => {
        const disconnect_id = sock.handshake.query.id;
        this.emitSocketData('disconnect_user', disconnect_id, sock);
        this.usersMap.delete(disconnect_id);
      });
    });
  }
  emitSocketData(event, data, socket, id) {
    socket.broadcast.emit(event, { [event]: data, id });
  }
}

module.exports = Socket;
