import React from 'react';
import { ToastContainer } from 'taalswap-uikit';
import useToast from 'hooks/useToast';

const ToastListener = () => {
  // @ts-ignore
  const { toasts, remove } = useToast();

  const handleRemove = (id: string) => remove(id);

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />;
};

export default ToastListener;
