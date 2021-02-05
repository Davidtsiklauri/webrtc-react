import { io, Socket } from 'socket.io-client';

export class SocketHelper {
  private socket: Socket;

  constructor(id: string) {
    this.socket = io('localhost:5000', {
      transports: ['websocket'],
      query: {
        id: id,
      },
    });
  }

  messageListener(cb: (data: RTCSessionDescriptionInit) => void) {
    this.socket.on('message', cb);
  }

  emit<T extends string>(type: T, data: any): void {
    if (this.socket) {
      this.socket.emit(type, data);
    }
  }
}
