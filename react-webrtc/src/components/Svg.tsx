import React, { CSSProperties } from 'react';

export const Svg = ({ background, ...rest }: { [K in keyof CSSProperties]: string }) => {
  try {
    const svg = require(`../../${background}`);
    //@ts-ignore
    return <img src={svg} alt="" style={rest} />;
  } catch (e) {
    console.warn('image not found', e);
    return <img alt="img not found" />;
  }
};
