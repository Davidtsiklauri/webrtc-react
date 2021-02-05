export class RtcpHelper {
  private peerConnection: RTCPeerConnection;
  constructor(configuration: RTCConfiguration) {
    this.peerConnection = new RTCPeerConnection(configuration);
  }

  async setDescription(description: RTCSessionDescriptionInit): Promise<RTCSessionDescription> {
    const remoteDesc = await new RTCSessionDescription(description);
    this.peerConnection.setRemoteDescription(remoteDesc);
    return remoteDesc;
  }

  async setLocalDescription(): Promise<RTCSessionDescriptionInit> {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    return offer;
  }

  async createAnswer(): Promise<RTCSessionDescriptionInit> {
    return await this.peerConnection.createAnswer();
  }

  async createLocalDescription(description: RTCSessionDescriptionInit): Promise<void> {
    return await this.peerConnection.setLocalDescription(description);
  }
}
