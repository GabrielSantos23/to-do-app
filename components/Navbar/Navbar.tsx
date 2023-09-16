import React from 'react';
import { ChevronsLeftRight, Plus, Search } from 'lucide-react';

import Image from 'next/image';
import { ProjectsNavbar } from './ProjectsNavbar';
import { Database } from '@/types_db';
import { Resizable } from 'react-resizable';
import ProjectList from './ProjectList';
import FavoriteProjects from './FavoritoProjects';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ProfileDetails from './ProfileDetails';

import { SettingsPage } from '../Settings';
import ResizableContainer from '../ResizableContainer';
import getProjectsByOrder from '@/actions/getProjectsByOrder';
import getUserInfo from '@/actions/getUserInfo';
import KbarButton from '../Kbar/KbarButton';

const Navbar = async ({}) => {
  const projects = await getProjectsByOrder();
  const user: any = await getUserInfo();

  const fullName = user?.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';

  if (user.length === 0) {
    return null;
  }

  return (
    <ResizableContainer>
      <div className=''>
        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className='flex group  items-center gap-3 hover:bg-[#2C2C2C] w-full  cursor-pointer px-4 py-3'>
              <Image
                className=' rounded'
                width={20}
                height={20}
                src={user.avatar_url || '/placeholder.jpeg'}
                alt={`${first}-profile-image`}
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
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-80 bg-[#252525] text-white border-[#2C2C2C] border'>
            <ProfileDetails />
          </DropdownMenuContent>
        </DropdownMenu>

        <div className='mt-0.5 w-full p-1'>
          {/* Search */}
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger
                className={` cursor-pointer   hover:bg-[#2C2C2C] w-full transition duration-100 rounded-sm px-4 py-2  `}
              >
                <KbarButton />
              </TooltipTrigger>
              <TooltipContent className='bg-[#202020] border border-[#2C2C2C] text-white'>
                <p className='text-xs'>Search and quickly jump to the page</p>
                <div className=' opacity-60 text-xs'>Ctrl + K</div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings */}
          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <SettingsPage />
              <TooltipContent className='bg-[#202020] border border-[#2C2C2C] text-white'>
                <p className='text-xs'>Your settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* New Project */}

          <TooltipProvider>
            <Tooltip delayDuration={200}>
              <TooltipTrigger
                className={` cursor-pointer   hover:bg-[#2C2C2C] w-full transition duration-100 rounded-sm px-4 py-2  `}
              >
                <div
                  className={` -mt-1 opacity-80 flex items-center cursor-pointer gap-3 `}
                >
                  <Plus
                    className=' p-0.5 rounded-full bg-white opacity-80 text-[#202020]'
                    width={15}
                    height={15}
                  />
                  <p className='text-[13px] font-medium'>New Page</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className='bg-[#202020] border border-[#2C2C2C] text-white'>
                <p className='text-xs'>Create new Project</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* workspace */}

      <div className='mt-10 group flex flex-col px-4 py-3'>
        <TooltipProvider>
          <Tooltip delayDuration={200}>
            <TooltipTrigger className={` cursor-pointer      `}>
              <div className='flex  justify-between '>
                <h2
                  className={`text-xs cursor-pointer flex hover:bg-[#2C2C2C]
                      transition duration-100 rounded-sm px-1 py-1  items-center gap-2
    `}
                >
                  Workspace
                </h2>
                <ProjectsNavbar
                  className='md:hidden group-hover:block  block'
                  projects={projects}
                />
              </div>
            </TooltipTrigger>
            <TooltipContent
              align='start'
              className='bg-[#202020] border border-[#2C2C2C] text-white'
            >
              <p className='text-xs'>Click to hide section</p>
              <p className='opacity-60 text-xs'>All your projects are here.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className={`mt-2  `}>
          <ProjectList projects={projects} />
        </div>
      </div>

      {/* favorites */}
      <div className='mt-5 group flex flex-col px-4 py-3'>
        <div className='flex flex-col  justify-between '>
          <div>
            {' '}
            <FavoriteProjects projects={projects} />
          </div>
        </div>
      </div>
    </ResizableContainer>
  );
};

export default Navbar;
