import React from 'react';
import { Modal } from 'antd';
import './video.css';

interface IModalProps {
  isVisible: boolean;
  onConfrim: () => any;
  onCancel: () => any;
  Component?: React.FC | null | any;
}

export const ModalWrapper = ({ isVisible, onConfrim, Component, onCancel }: IModalProps) => {
  return (
    <Modal visible={isVisible} onOk={onConfrim} onCancel={onCancel}>
      {React.isValidElement(Component) ? Component : <Component />}
    </Modal>
  );
};
