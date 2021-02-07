import React from 'react';

export const Video = React.forwardRef((props, ref: React.ForwardedRef<HTMLVideoElement>) => (
  <video ref={ref}></video>
));
