import React from 'react';
import { Modal, Button } from 'antd';

interface IModalProps {
  isVisible: boolean;
  onConfrim: () => any;
  Component?: React.FC | null;
}

export const ModalWrapper = ({ isVisible, onConfrim, Component }: IModalProps) => {
  return (
    <Modal visible={isVisible} onOk={onConfrim}>
      {Component && <Component />}
    </Modal>
  );
};
