'use client';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { useState } from 'react';
interface AvatarProps {
  imageUrl?: string;
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className='relative'>
      <div className='relative inline-block rounded-md  overflow-hidden  '>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
        >
          <LazyLoadImage
            alt='Avatar'
            src={imageUrl ? imageUrl : `/icon-512.png`}
            threshold={0}
            effect='opacity'
            afterLoad={handleImageLoad}
            placeholderSrc='/icon-512.png'
            className=' object-cover w-24 h-24 md:h-32 md:w-32 '
          />
        </motion.div>
      </div>
    </div>
  );
};

export default Avatar;
