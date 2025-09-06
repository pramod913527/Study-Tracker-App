import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export default {
  title: 'Design System/Modal',
  component: Modal,
};

export const Basic = () => {
  const [open, setOpen] = useState(true);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Demo Modal">
        Modal content goes here.
      </Modal>
    </>
  );
};
