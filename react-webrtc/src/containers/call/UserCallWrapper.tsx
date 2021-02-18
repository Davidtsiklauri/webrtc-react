import React, { useEffect, useState } from 'react';
import ActiveUserListWrapper from './ActiveUserListWrapper';
import VideoCallWrapper from './VideoCallWrapper';

import uuid from 'react-uuid';
import './video.sass';
import { CONFIG } from '../../config/config';
import { RtcpHelper, SocketHelper } from '../../helper';
import { EVENT } from '../../models/socket.interface';
import { PersistentStorage } from '../../shared/classes/persistent.storage';
import { ModalWrapper } from '../../shared/components/Modal';
import { updateStatus } from './callSlice';
import { connect } from 'react-redux';

const id = uuid(),
  rtcpHelper = new RtcpHelper(CONFIG),
  socket = new SocketHelper(id),
  mapDispatch = { updateStatus },
  mapStateProps = (state) => ({ state: state.call });

const UserCallWrapper = ({ updateStatus, state }) => {
  const [isVisible, setVisibility] = useState(false);
  const [offer, setOffer] = useState({});

  useEffect(() => {
    const storage = new PersistentStorage(localStorage);
    storage.setItem('id', id);

    rtcpHelper.addEventListener('connectionstatechange', (ev: RTCPeerConnectionIceEvent) => {
      // setCallHangup(false);
    });

    rtcpHelper.peerConnection.oniceconnectionstatechange = () => {
      const status = rtcpHelper.peerConnection.iceConnectionState;
      if (status === 'disconnected') {
      }
      if (status === 'connected') {
        updateStatus({ status: 'PROGRESS' });
      }
    };

    socket.messageListener<EVENT>(async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
      setVisibility(true);
      setOffer(offer);
    }, 'offer');

    socket.messageListener<EVENT>(({ answer }: { answer: RTCSessionDescriptionInit }) => {
      rtcpHelper.setDescription(answer);
    }, 'answer');
    socket.messageListener<EVENT>((ev: any) => {
      updateStatus({ status: 'START' });
      rtcpHelper.peerConnection.close();
      console.log(rtcpHelper);
    }, 'close');
  }, []);

  const makeCall = async () => {
    updateStatus({ status: 'PENDING' });
    try {
      await rtcpHelper.setLocalDescription();
      setTimeout(async () => {
        const offer = await rtcpHelper.setLocalDescription();
        socket.emit<EVENT>('offer', offer);
      }, 0);
    } catch (e) {
      console.log(e);
    }
  };

  const closeCall = () => {
    updateStatus({ status: 'START' });
    rtcpHelper.peerConnection.close();
    socket.emit<EVENT>('close', id);
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
      <div className="d-flex justify-content-center border-2 second-border call">
        <VideoCallWrapper rtcpHelper={rtcpHelper} closeCallFn={closeCall} />
      </div>
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
