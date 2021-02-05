import React from 'react';

export const Video = React.forwardRef((props, ref: React.ForwardedRef<HTMLVideoElement>) => (
  <video width="750" height="500" ref={ref}></video>
));
