import React, { createRef, useEffect, useState } from 'react';
import { Button } from 'antd';

import { Video } from './shared/components/Video';

import { CONFIG } from './config/config';

import './app.css';

import { getUserMedia, SocketHelper } from './helper/index';
import { RtcpHelper } from './helper/rtcpHelper';
//@ts-ignore
// fuck react -> robi aslanian
import uuid from 'react-uuid';
import { ModalWrapper } from './shared/components/Modal';

import { ActiveUserListWrapper } from './components/ActiveUserListWrapper';
import { EVENT } from './models/socket.interface';
import { PersistentStorage } from './shared/classes/persistent.storage';

const rtcpHelper = new RtcpHelper(CONFIG),
  id = uuid(),
  socket = new SocketHelper(id),
  videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>;

function App() {
  const [isVisible, setVisibility] = useState(false);
  const [offer, setOffer] = useState({});
  const [isCallHangup, setCallHangup] = useState(true);
  const storage = new PersistentStorage(localStorage);
  storage.setItem('id', id);

  useEffect(() => {
    rtcpHelper.addEventListener('connectionstatechange', (ev: RTCPeerConnectionIceEvent) => {
      setCallHangup(false);
    });

    rtcpHelper.peerConnection.oniceconnectionstatechange = () =>
      console.log(rtcpHelper.peerConnection.iceConnectionState);

    socket.messageListener<EVENT>(async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      console.log('offer', offer);

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
        const stream: MediaStream = await getUserMedia();
        if (callVideoRef.current) {
          const { current } = callVideoRef;
          current.srcObject = stream;
          current.muted = true;
          stream.getTracks().forEach((track) => rtcpHelper.peerConnection.addTrack(track, stream));
        }
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const makeCall = async () => {
    /**
     * @Temporary
     * call doesnot made on first setLocalDescription
     */
    await rtcpHelper.setLocalDescription();
    setTimeout(async () => {
      const offer = await rtcpHelper.setLocalDescription();
      socket.emit<EVENT>('offer', offer);
    }, 0);
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
      <div className="d-flex border-2 second-border call">
        <div className="video-container">
          <Video ref={callVideoRef} />
          {/* <Video ref={videoRef} poster={hangUpPng} /> */}
        </div>
      </div>
      {/* {(isCallHangup && (
        <Button onClick={() => makeCall()} type="primary">
          Make A Call
        </Button>
      )) || (
        <Button onClick={closeCall} type="primary">
          Close Call
        </Button>
      )} */}

      <ActiveUserListWrapper socket={socket} cb={makeCall} />

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
