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
      sock.on('answer', (data) => {
        cb(data, sock, sock.handshake.query, 'answer');
      });
      sock.on('offer', (data) => {
        cb(data, sock, sock.handshake.query, 'offer');
      });
    });
  }

  emitSocketData(event, data, socket, id) {
    socket.emit(event, { offer: data, id });
  }
}

module.exports = Socket;
