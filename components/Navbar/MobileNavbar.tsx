'use client';

import useUploadModal from '@/hooks/useUploadModal';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';
import { motion, useAnimation } from 'framer-motion';
import { ChevronsLeftRight, Menu } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import Image from 'next/image';
import ProfileDetails from './ProfileDetails';
import useLoadImage from '@/hooks/useLoadImage';

interface MobileNavbarProps {
  projects: Database['public']['Tables']['projects']['Row'][];
  favorito: any;
  children: React.ReactNode;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({
  favorito,
  projects,
  children,
}) => {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const uploadModal = useUploadModal();
  const { user, userDetails } = useUser();
  const loadImage = useLoadImage(userDetails);
  const fullName = userDetails?.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';
  const navbarControls = useAnimation();

  useEffect(() => {
    if (isNavbarOpen) {
      // Abra a barra de navegação
      navbarControls.start({ x: 0 });
    } else {
      // Feche a barra de navegação (coloque-a para fora da tela)
      navbarControls.start({ x: '-100%' });
    }
  }, [isNavbarOpen, navbarControls]);

  const onClick = () => {
    return uploadModal.onOpen();
  };

  if (!user) {
    return null;
  }
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };
  return (
    <>
      <div className='flex flex-col  w-full'>
        <div className='flex sm:hidden    relative h-10 items-center justify- bg-[#191919] border-b border-stone-500/50    '>
          <button
            onClick={toggleNavbar}
            className='
          h-[40px] w-[40px]  z-[100]'
          >
            <Menu className='block sm:hidden ml-2     ' />
          </button>
          <div className=' w-full  -ml-4 flex justify-center'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex justify-between group items-center hover:bg-[#2C2C2C]  '>
                  <div className='flex   items-center gap-3  w-full  cursor-pointer px-4 py-3'>
                    <Image
                      className=' rounded'
                      width={20}
                      height={20}
                      src={loadImage || '/placeholder.jpeg'}
                      alt={`${userDetails?.full_name}-profile-image`}
                    />
                    <p className='lowercase text-sm font-semibold  flex items-center gap-2 '>
                      {first}&apos;s List{' '}
                      <span>
                        <ChevronsLeftRight
                          className='rotate-90 opacity-70'
                          width={15}
                          height={15}
                        />
                      </span>
                    </p>
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent className='w-80  text-white border-[#2C2C2C] border bg-[#252525]'>
                <ProfileDetails />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className='flex'>
          <motion.div
            className='h-full  '
            initial={{ x: '-100%' }} // Define a posição inicial fora da tela
            animate={navbarControls}
          >
            a
          </motion.div>
          {children}
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
