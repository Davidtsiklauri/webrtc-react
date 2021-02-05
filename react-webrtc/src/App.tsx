import React, { createRef } from 'react';
import { Video } from './components/Video';
import { userMedia, SocketHelper } from './helper/index';
import { io } from 'socket.io-client';

function App() {
  const socket = new SocketHelper(io);
  const videoRef = createRef() as React.RefObject<HTMLVideoElement>;
  (async () => {
    const stream: MediaStream = await userMedia.getUserMedia();
    if (videoRef.current) {
      const { current } = videoRef;
      current.srcObject = stream;
      current.play();
    }
  })();

  // const signalingChannel = new SignalingChannel(remoteClientId);
  // signalingChannel.addEventListener('message', message => {
  // });

  // signalingChannel.send('Hello!');

  const makeCall = async () => {
    console.log('in Make Call');

    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    // signalingChannel.addEventListener('message', async message => {
    //     if (message.answer) {
    //         const remoteDesc = new RTCSessionDescription(message.answer);
    //         await peerConnection.setRemoteDescription(remoteDesc);
    //     }
    // });
    const offer = await peerConnection.createOffer();
    console.log(offer);

    await peerConnection.setLocalDescription(offer);
    // signalingChannel.send({'offer': offer});
  };

  return (
    <>
      <Video ref={videoRef} />
      <button onClick={makeCall}>Make A Call</button>
    </>
  );
}

export default App;
