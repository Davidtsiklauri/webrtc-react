import React, { createRef, useEffect, useState } from 'react';
import { Button } from 'antd';

import { Video } from './components/Video';

import { CONFIG } from './config/config';
import { EVENT } from './helper/socketHelper';

import './app.css';

import { userMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';
import { ModalWrapper } from './components/Modal';

const rtcpHelper = new RtcpHelper(CONFIG),
  id = uuid(),
  socket = new SocketHelper(id),
  videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>;

function App() {
  const [isVisible, setVisibility] = useState(false);
  const [offer, setOffer] = useState({});
  const [isCallHangup, setCallHangup] = useState(true);

  useEffect(() => {
    rtcpHelper.addEventListener('icecandidate', (ev: RTCPeerConnectionIceEvent) => {
      console.log(ev.candidate);
      if (ev.candidate) {
        rtcpHelper.peerConnection
          .addIceCandidate(ev.candidate)
          .then(console.log)
          .catch(console.log);
      }
    });

    rtcpHelper.addEventListener('connectionstatechange', (ev: RTCPeerConnectionIceEvent) => {
      // console.log(ev);
      setCallHangup(false);
    });

    rtcpHelper.addEventListener('connectionstatechange', (ev: RTCPeerConnectionIceEvent) => {
      console.log('PEERS CONNECTEd');
    });

    socket.messageListener<EVENT>(async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      setVisibility(true);
      setOffer(offer);
    }, 'offer');

    socket.messageListener<EVENT>(({ answer }: { answer: RTCSessionDescriptionInit }) => {
      rtcpHelper.setDescription(answer);
    }, 'answer');

    rtcpHelper.peerConnection.ontrack = ({ streams: [stream] }) => {
      if (videoRef.current) {
        const { current } = videoRef;
        current.srcObject = stream;
      }
    };

    (async () => {
      try {
        const stream: MediaStream = await userMedia.getUserMedia();
        if (callVideoRef.current) {
          const { current } = callVideoRef;
          current.srcObject = stream;
          stream.getTracks().forEach((track) => rtcpHelper.peerConnection.addTrack(track, stream));
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

  const closeCall = () => {
    rtcpHelper.peerConnection.close();
    setCallHangup(true);
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
      <div className="d-flex border-2 second-border">
        <Video ref={callVideoRef} />
        <Video ref={videoRef} />
      </div>
      {(isCallHangup && (
        <Button onClick={makeCall} type="primary">
          Make A Call
        </Button>
      )) || (
        <Button onClick={closeCall} type="primary">
          Close Call
        </Button>
      )}

      <ModalWrapper
        isVisible={isVisible}
        onConfrim={() => onModalClose(false)}
        onCancel={() => onModalClose(true)}
        Component={<p>Answer Call:</p>}
      ></ModalWrapper>
    </>
  );
}

export default App;
