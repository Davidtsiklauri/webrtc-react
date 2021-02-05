import React, { createRef } from 'react';
import { Video } from './components/Video';
import { userMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
type emit = 'signal';
const id = uuid();

function App() {
  const socket = new SocketHelper(id);
  const rtcpHelper = new RtcpHelper(config);

  const videoRef = createRef() as React.RefObject<HTMLVideoElement>;
  (async () => {
    try {
      const stream: MediaStream = await userMedia.getUserMedia();
      if (videoRef.current) {
        const { current } = videoRef;
        current.srcObject = stream;
        current.play();
      }
    } catch (e) {
      console.log(e);
    }
  })();

  // const signalingChannel = new SignalingChannel(remoteClientId);
  // signalingChannel.addEventListener('message', message => {
  // });

  // signalingChannel.send('Hello!');

  const makeCall = async () => {
    socket.messageListener((data: RTCSessionDescriptionInit) => {
      rtcpHelper.setDescription(data);
      console.log(data);
    });
    const offer = await rtcpHelper.setLocalDescription();
    socket.emit<emit>('signal', offer);
  };

  return (
    <>
      <Video ref={videoRef} />
      <button onClick={makeCall}>Make A Call</button>
    </>
  );
}

export default App;
