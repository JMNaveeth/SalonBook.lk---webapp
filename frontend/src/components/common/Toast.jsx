import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1f1f1f',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '12px 16px',
          fontSize: '14px',
        },
        success: {
          iconTheme: {
            primary: '#1a9e74',
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastContainer;
