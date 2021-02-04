import React, { createRef } from 'react';
import { userMedia } from '../utils/mediaHelper';

export const Video = () => {
  const videoRef = createRef() as React.RefObject<HTMLVideoElement>;
  (async () => {
    const stream: MediaStream = await userMedia.getUserMedia();
    if (videoRef.current) {
      const { current } = videoRef;
      current.srcObject = stream;
      current.play();
    }
  })();

  return <video width="750" height="500" ref={videoRef}></video>;
};
