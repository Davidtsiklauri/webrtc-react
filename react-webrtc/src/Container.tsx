import React, { useEffect, useState } from 'react';
import { ModalWrapper } from './components/Modal';
import { SocketHelper } from './helper';

export const Container = ({ refIsVisibile }: any) => {
  useEffect(() => {
    console.log('trigerred in useffect');
  }, [refIsVisibile.current]);

  const logger = () => {};
  return <ModalWrapper isVisible={refIsVisibile.current} onConfrim={logger} />;
};
