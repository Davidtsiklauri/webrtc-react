export class SocketHelper {
  private socket: any = null;

  constructor(socket: any) {
    this.socket = socket;
    this.initSocket();
  }

  private initSocket() {
    console.log(this.socket);
    if (this.socket) {
      //   this.socket.on('connection', (sock: any) => {
      //     console.log(sock);
      //   });
    }
  }
}
