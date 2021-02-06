import React, { createRef, useRef, useState } from 'react';
import { Video } from './components/Video';
import { userMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';
import { Container } from './Container';
import 'antd/dist/antd.css';

const config = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
type event = 'offer' | 'answer';
const id = uuid();
const socket = new SocketHelper(id);

function App() {
  const rtcpHelper = new RtcpHelper(config);
  const ref = useRef(false);
  console.log('here');

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

  socket.messageListener<event>(async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
    ref.current = true;
    console.log(ref);

    // await rtcpHelper.setDescription(offer);
    // const answer = await rtcpHelper.createAnswer();
    // await rtcpHelper.createLocalDescription(answer);
    // socket.emit<event>('answer', answer);
  }, 'offer');

  socket.messageListener<event>(({ answer }: { answer: RTCSessionDescriptionInit }) => {
    // rtcpHelper.setDescription(answer);
    console.log('zura');
  }, 'answer');

  const makeCall = async () => {
    const offer = await rtcpHelper.setLocalDescription();
    socket.emit<event>('offer', offer);
  };

  return (
    <>
      <Video ref={videoRef} />
      <button onClick={makeCall}>Make A Call</button>
      <Container refIsVisibile={ref} />
    </>
  );
}

export default App;
