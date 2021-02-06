import React, { createRef, useEffect, useState } from 'react';

import { Video } from './components/Video';

import { CONFIG } from './config/config';
import { EVENT } from './helper/socketHelper';

import { userMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';
import { ModalWrapper } from './components/Modal';

const rtcpHelper = new RtcpHelper(CONFIG),
  id = uuid(),
  socket = new SocketHelper(id);

function App() {
  const videoRef = createRef() as React.RefObject<HTMLVideoElement>;
  const [isVisible, setVisibility] = useState(false);
  const [offer, setOffer] = useState({});

  useEffect(() => {
    rtcpHelper.addEventListener('icecandidate', (ev: RTCPeerConnectionIceEvent) => {
      console.log(ev);
    });

    rtcpHelper.addEventListener('connectionstatechange', (ev: RTCPeerConnectionIceEvent) => {
      console.log(ev);
    });

    socket.messageListener<EVENT>(async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      setVisibility(true);
      setOffer(offer);
    }, 'offer');

    socket.messageListener<EVENT>(({ answer }: { answer: RTCSessionDescriptionInit }) => {
      rtcpHelper.setDescription(answer);
    }, 'answer');

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
  }, []);

  const makeCall = async () => {
    const offer = await rtcpHelper.setLocalDescription();

    socket.emit<EVENT>('offer', offer);
  };

  const onModalClose = async (isCancel: boolean = false) => {
    if (!isCancel) {
      await rtcpHelper.setDescription(offer);
      const answer = await rtcpHelper.createAnswer();
      await rtcpHelper.createLocalDescription(answer);
      socket.emit<EVENT>('answer', answer);
    }
    setVisibility(false);
  };

  return (
    <>
      <Video ref={videoRef} />
      <button onClick={makeCall}>Make A Call</button>
      <ModalWrapper
        isVisible={isVisible}
        onConfrim={() => onModalClose(false)}
        onCancel={() => onModalClose(true)}
      ></ModalWrapper>
    </>
  );
}

export default App;
