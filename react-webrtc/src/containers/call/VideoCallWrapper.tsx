import React, { createRef, useEffect } from 'react';
import { Video } from '../../components/Video';
import { getUserMedia, RtcpHelper } from '../../helpers/index';
import { connect } from 'react-redux';
import { Loader } from '../../components/Loader';
import { IStatusState } from '../models/activeUsers.interface';
import { Svg } from '../../components/Svg';

const videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>,
  mapStateProps = (state) => ({ state: state.call });

interface IVideoCallWrapperProps {
  rtcpHelper: RtcpHelper;
  state: IStatusState;
  closeCallFn: any;
}

const VideoCallWrapper = ({ rtcpHelper, state, closeCallFn }: IVideoCallWrapperProps) => {
  useEffect(() => {
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

    rtcpHelper.peerConnection.ontrack = ({ streams: [stream] }) => {
      if (videoRef.current) {
        const { current } = videoRef;
        current.srcObject = stream;
      }
    };
  }, []);

  return (
    <div className="video-container">
      <Video
        ref={callVideoRef}
        className={`${state.status === 'PROGRESS' && 'active-video'} position-absoulute`}
      />
      {state.status === 'PENDING' && <Loader />}
      <Video
        ref={videoRef}
        className={`position-absoulute ${state.status === 'START' && 'hidden'}`}
      />

      {state.status === 'PROGRESS' && (
        <button onClick={closeCallFn}>
          <Svg
            background="assets/hang-up.svg"
            height="30px"
            width="30px"
            position="absolute"
            zIndex="3"
            bottom="19px"
            cursor="pointer"
          />
        </button>
      )}
    </div>
  );
};

export default connect(mapStateProps)(VideoCallWrapper);
