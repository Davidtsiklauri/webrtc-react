import React, { createRef, useEffect } from 'react';
import { Video } from '../../shared/components/Video';
import { getUserMedia, RtcpHelper } from '../../helper/index';

const videoRef = createRef() as React.RefObject<HTMLVideoElement>,
  callVideoRef = createRef() as React.RefObject<HTMLVideoElement>;

interface IVideoCallWrapperProps {
  rtcpHelper: RtcpHelper;
}

export const VideoCallWrapper = ({ rtcpHelper }: IVideoCallWrapperProps) => {
  useEffect(() => {
    (async () => {
      try {
        const stream: MediaStream = await getUserMedia();
        if (callVideoRef.current) {
          const { current } = callVideoRef;
          current.srcObject = stream;
          current.muted = true;
          stream.getTracks().forEach((track) => rtcpHelper.peerConnection.addTrack(track, stream));
          stream.addEventListener('removetrack', (v) => {
            console.log(v);
          });
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
      <Video ref={callVideoRef} />
      {(() => {
        if (true) {
          return <Video ref={videoRef} className="active-video" />;
        }
      })()}
    </div>
  );
};
