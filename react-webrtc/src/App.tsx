import React, { createRef } from 'react';
import { Video } from './components/Video';
import { userMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
type event = 'offer' | 'answer';
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

  socket.messageListener<event>(async (data: RTCSessionDescriptionInit) => {
    console.log(data, id);
    // await rtcpHelper.setDescription(data);
    // const answer = await rtcpHelper.createAnswer();
    // await rtcpHelper.createLocalDescription(answer);
    // socket.emit<event>('answer', answer);
  }, 'offer');

  const makeCall = async () => {
    socket.messageListener<event>((data: RTCSessionDescriptionInit) => {
      // rtcpHelper.setDescription(data);
    }, 'answer');
    const offer = await rtcpHelper.setLocalDescription();
    socket.emit<event>('offer', offer);
  };

  return (
    <>
      <Video ref={videoRef} />
      <button onClick={makeCall}>Make A Call</button>
    </>
  );
}

export default App;
