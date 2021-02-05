import { io, Socket } from 'socket.io-client';

export class SocketHelper {
  private socket: Socket | null = null;

  constructor() {
    this.socket = io('localhost:5000', {
      transports: ['websocket'],
    });
    this.initSocket();
  }

  private initSocket() {
    if (this.socket) {
      this.socket.on('connection', (sock: any) => {
        console.log('connected');
      });
      this.socket.on('gia', (data: any) => {
        console.log(data);
      });
    }
  }
}
