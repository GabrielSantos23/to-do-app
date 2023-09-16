'use client';

import React, { useState } from 'react';
import { Resizable } from 'react-resizable';

const ResizableContainer = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState(280);

  const onResize = (event: any, { size }: { size: { width: number } }) => {
    setWidth(size.width);
  };

  return (
    <Resizable
      width={width}
      height={Infinity}
      handle={<div className='resize-area' />}
      onResize={onResize}
      minConstraints={[280, Infinity]}
      maxConstraints={[400, Infinity]}
    >
      <div
        style={{ width: `${width}px` }}
        className='relative navbar border-r-[#282A2D]  border-r h-screen w-full bg-[#202020] '
      >
        {children}
      </div>
    </Resizable>
  );
};

export default ResizableContainer;
