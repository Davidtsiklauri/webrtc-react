import React, { createRef, useEffect, useState } from 'react';
import { ActiveUserListWrapper } from './ActiveUserListWrapper';

import uuid from 'react-uuid';
import './video.sass';
import { CONFIG } from '../../config/config';
import { RtcpHelper, SocketHelper, getUserMedia } from '../../helper';
import { EVENT } from '../../models/socket.interface';
import { PersistentStorage } from '../../shared/classes/persistent.storage';
import { ModalWrapper } from '../../shared/components/Modal';
import { Video } from '../../shared/components/Video';
import { updateStatus } from './callSlice';
import { connect } from 'react-redux';

const rtcpHelper = new RtcpHelper(CONFIG),
  id = uuid(),
  socket = new SocketHelper(id),
  videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>,
  mapDispatch = { updateStatus },
  mapStateProps = (state) => ({ state: state.call });

const UserCallWrapper = ({ updateStatus, state }) => {
  const [isVisible, setVisibility] = useState(false);
  const [offer, setOffer] = useState({});
  const [isCall, setCallHangup] = useState(true);
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
    updateStatus({ status: 'PENDING' });
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
  // className="active-video"
  return (
    <>
      <div className="d-flex justify-content-center border-2 second-border call">
        <div className="video-container">
          {state.status}
          {/* <Video ref={callVideoRef} /> */}
          {/* <Video ref={videoRef} /> */}
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
};

export default connect(mapStateProps, mapDispatch)(UserCallWrapper);
