import React from 'react';

interface IProps {
  poster?: string;
  className?: string;
}

export const Video = React.forwardRef(
  (props: IProps, ref: React.ForwardedRef<HTMLVideoElement>) => {
    const { className, poster } = props;
    return <video ref={ref} poster={poster} autoPlay className={className}></video>;
  },
);
