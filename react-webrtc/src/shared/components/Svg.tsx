import React from 'react';

export const Svg = ({ url, ...rest }: { [K in keyof React.CSSProperties]: string } | any) => {
  try {
    const svg = require(`../../${url}`);
    return <img src={svg} alt="" style={rest} />;
  } catch (e) {
    console.warn('image not found', e);
    return <img alt="img not found" />;
  }
};
