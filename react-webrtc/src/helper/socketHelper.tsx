import { io, Socket } from 'socket.io-client';

export class SocketHelper {
  private socket: Socket;

  constructor(id: string) {
    this.socket = io('localhost:5000', {
      transports: ['websocket'],
      query: {
        id,
      },
    });
  }

  messageListener<T extends string>(cb: (data: RTCSessionDescriptionInit) => void, event: T) {
    this.socket.on(event, cb);
  }

  emit<T extends string>(type: T, data: any): void {
    if (this.socket) {
      this.socket.emit(type, data);
    }
  }
}
