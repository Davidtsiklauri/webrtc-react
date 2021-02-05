class Socket {
    /**
     * @private
    */
    socket = null;
    constructor(socket) {
        this.socket = socket;
        this.initSocket();
    }

    /**
     * @private
     */
    initSocket() {
        if(this.socket) {
            this.socket.on(('connection'), (sock) => {
               sock.emit('test', 'test')
            })
        }
    }
}

module.exports = Socket;