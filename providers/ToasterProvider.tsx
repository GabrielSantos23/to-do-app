'use client';

import { Toaster } from 'react-hot-toast';

const ToasterProvider = () => {
  return (
    <Toaster
      position='top-right'
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: '5px',
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
};

export default ToasterProvider;
