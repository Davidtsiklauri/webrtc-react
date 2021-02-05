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
        console.log(this.socket);
        if(this.socket) {
            this.socket.on(('connection'), (sock) => {
                console.log(sock);
            })
        }
    }
}

module.exports = Socket;