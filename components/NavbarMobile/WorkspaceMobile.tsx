'use client';

import { Database } from '@/types_db';
import { ProjectsNavbar } from '../Navbar/ProjectsNavbar';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { File } from 'lucide-react';
import MenuFunctions from '../Navbar/menuFunctions';

interface WorkspaceMobileProps {
  projects: Database['public']['Tables']['projects']['Row'][];
}

const WorkspaceMobile: React.FC<WorkspaceMobileProps> = ({ projects }) => {
  const { user } = useUser();
  const router = useRouter();
  const [isloading, setIsloading] = useState(false);
  return (
    <div>
      <div className='flex justify-between items-center py-4 px-4'>
        <h2 className='text-white/20 font-bold '>Workspace</h2>
        <ProjectsNavbar
          className='md:hidden group-hover:block   block'
          projects={projects}
        />
      </div>

      {projects.map((project, index) => (
        <div key={project?.id} className='border-b border-stone-500/50'>
          <div className={`  relative flex items-center justify-between px-4`}>
            <div className='  py-2 '>
              {project ? (
                <h3
                  className='text-xl flex   items-center justify-start gap-2 truncate   '
                  style={{ zIndex: 2 }}
                >
                  {isloading && project.emoji ? (
                    <span className='w-full h-5 bg-[#2F2F2F] rounded-sm animate-pulse text-transparent'>
                      {project?.emoji}
                    </span>
                  ) : project?.emoji && !isloading ? (
                    <span className='h-[20px] w-[20px] text-sm'>
                      {project?.emoji}
                    </span>
                  ) : !project.emoji && isloading ? (
                    <span className='w-full h-5 bg-[#2F2F2F] rounded-sm animate-pulse text-transparent '>
                      <File width={20} height={20} />
                    </span>
                  ) : (
                    !project.emoji &&
                    !isloading && <File width={20} height={20} />
                  )}

                  {isloading ? (
                    <span className='w-full h-5 bg-[#2F2F2F]  rounded-sm animate-pulse text-transparent '>
                      {project.name}
                    </span>
                  ) : (
                    <p className='text-white/50'>{project.name}</p>
                  )}
                </h3>
              ) : (
                <span className='w-full h-5 bg-[#2F2F2F] rounded-sm animate-pulse'></span>
              )}
            </div>
            <MenuFunctions project={project} projects={projects} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkspaceMobile;
