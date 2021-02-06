import React from 'react';
import { Modal, Button } from 'antd';

interface IModalProps {
  isVisible: boolean;
  onConfrim: () => any;
  onCancel: () => any;
  Component?: React.FC | null;
}

export const ModalWrapper = ({ isVisible, onConfrim, Component, onCancel }: IModalProps) => {
  return (
    <Modal visible={isVisible} onOk={onConfrim} onCancel={onCancel}>
      {Component && <Component />}
    </Modal>
  );
};
