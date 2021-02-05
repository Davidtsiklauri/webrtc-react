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
        console.log(sock.handshake.query);
        cb(data, sock);
      });
    });
  }

  emitSocketData(event, data, socket) {
    socket.broadcast.emit(event, data);
  }
}

module.exports = Socket;
