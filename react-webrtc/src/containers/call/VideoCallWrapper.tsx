import React, { createRef, useEffect } from 'react';
import { Video } from '../../shared/components/Video';
import { getUserMedia, RtcpHelper } from '../../helper/index';
import { connect } from 'react-redux';
import { Loader } from '../../shared/components/Loader';
import { IStatusState } from '../../models/activeUsers.interface';
// import hang from '../../assets/hang-up.svg';
import { Svg } from '../../shared/components/Svg';

const videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>,
  mapStateProps = (state) => ({ state: state.call });

interface IVideoCallWrapperProps {
  rtcpHelper: RtcpHelper;
  state: IStatusState;
}

const VideoCallWrapper = ({ rtcpHelper, state }: IVideoCallWrapperProps) => {
  console.log();

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
      <Video ref={videoRef} className="position-absoulute" />
      <Svg url="assets/hang-up.svg" width={30} height={30} gia="absoulute" />
    </div>
  );
};

export default connect(mapStateProps)(VideoCallWrapper);
