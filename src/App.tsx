import React, { createRef } from 'react';
import { Video } from './components/Video';
import { userMedia } from './utils/mediaHelper';

function App() {
  const videoRef = createRef() as React.RefObject<HTMLVideoElement>;
  (async () => {
    const stream: MediaStream = await userMedia.getUserMedia();
    if (videoRef.current) {
      const { current } = videoRef;
      current.srcObject = stream;
      current.play();
    }
  })();

  return <Video ref={videoRef} />;
}

export default App;
