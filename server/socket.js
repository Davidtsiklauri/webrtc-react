class Socket {
  /**
   * @private
   */
  socket = null;
  constructor(socket) {
    this.socket = socket;
  }

  getSocket(cb) {
    this.socket.on('connection', (sock) => {
      sock.on('signal', (data) => {
        cb(data, sock, sock.handshake.query);
      });
    });
  }

  emitSocketData(event, data, socket, id) {
    socket.broadcast.except(socket.id).emit(event, data);
  }
}

module.exports = Socket;
