import React from 'react';

export const Video = React.forwardRef((props: any, ref: React.ForwardedRef<HTMLVideoElement>) => (
  <video ref={ref} poster={props?.poster} autoPlay></video>
));
