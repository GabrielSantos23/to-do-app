'use client';

import React, { useEffect, useState } from 'react';
import {
  ChevronDown,
  ChevronsLeftRight,
  Command,
  Heart,
  LogOut,
  Plus,
  Search,
  Settings,
} from 'lucide-react';

import { AiFillSetting } from 'react-icons/ai';
import Link from 'next/link';
import useAuthModal from '@/hooks/useAuthModal';
import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { BiSolidUser } from 'react-icons/bi';
import Image from 'next/image';
import { useKBar } from 'kbar';
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

const Navbar = ({}) => {
  const [divVisivel, setDivVisivel] = useState('Home');
  const authModal = useAuthModal();
  const { query } = useKBar();
  const { user } = useUser();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const { supabaseClient } = useSessionContext();

  const [width, setWidth] = useState(280);

  const router = useRouter();

  const [projects, setProjects] = useState<
    Database['public']['Tables']['projects']['Row'][]
  >([]);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [showProjectList, setShowProjectList] = useState(true);
  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('order')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    };

    fetchProjects();
  }, [supabaseClient, isCreatingProject, user]);

  if (!user) {
    return null;
  }
  const toggleProjectList = () => {
    setShowProjectList(!showProjectList);
  };

  const itemStyle =
    'flex items-center cursor-pointer gap-3 opacity-80  hover:bg-[#2C2C2C] transition duration-100 rounded-sm px-4 py-2 mx-1';

  const onResize = (event: any, { size }: { size: { width: number } }) => {
    setWidth(size.width);
  };

  const fullName = user?.user_metadata.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';

  const handleProfileOpenModal = () => {
    setIsProfileModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsProfileModalOpen(false);
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
        <div className=''>
          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className='flex group  items-center gap-3 hover:bg-[#2C2C2C] w-full  cursor-pointer px-4 py-3'>
                <Image
                  className=' rounded'
                  width={20}
                  height={20}
                  src={user?.user_metadata.picture || '/placeholder.jpeg'}
                  alt={`${user?.user_metadata.full_name}-profile-image`}
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
                  onClick={query.toggle}
                >
                  <div className='opacity-80 flex items-center cursor-pointer gap-3'>
                    <Search width={15} height={15} />
                    <p className='text-[13px] font-medium'>Search</p>
                  </div>
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
                <TooltipTrigger
                  className={` cursor-pointer   hover:bg-[#2C2C2C] w-full transition duration-100 rounded-sm px-4 py-2  `}
                >
                  <div
                    className={` -mt-1 opacity-80 flex items-center cursor-pointer gap-3 `}
                  >
                    <Settings width={15} height={15} />
                    <p className='text-[13px] font-medium'>Settings</p>
                  </div>
                </TooltipTrigger>
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
                    onClick={toggleProjectList}
                    className={`text-xs cursor-pointer flex hover:bg-[#2C2C2C]
                    transition duration-100 rounded-sm px-1 py-1  items-center gap-2  ${
                      !showProjectList && 'opacity-100'
                    }  hover:opacity-100 opacity-60 font-medium`}
                  >
                    Workspace
                    {!showProjectList && (
                      <span>
                        <ChevronDown
                          width={20}
                          height={20}
                          className='pt-0.5'
                        />
                      </span>
                    )}
                  </h2>
                  <ProjectsNavbar
                    className='md:hidden group-hover:block  block'
                    setProjects={setProjects}
                    setIsCreatingProject={setIsCreatingProject}
                    projects={projects}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                align='start'
                className='bg-[#202020] border border-[#2C2C2C] text-white'
              >
                <p className='text-xs'>Click to hide section</p>
                <p className='opacity-60 text-xs'>
                  All your projects are here.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className={`mt-2 ${showProjectList ? 'block' : 'hidden'}`}>
            <ProjectList
              projects={projects}
              setProjects={setProjects}
              setIsCreatingProject={setIsCreatingProject}
            />
          </div>
        </div>

        {/* favorites */}
        <div className='mt-5 group flex flex-col px-4 py-3'>
          <div className='flex flex-col  justify-between '>
            <div>
              {' '}
              <FavoriteProjects
                projects={projects}
                setIsCreatingProject={setIsCreatingProject}
                setProjects={setProjects}
              />
            </div>
          </div>
        </div>
      </div>
    </Resizable>
  );
};

export default Navbar;
