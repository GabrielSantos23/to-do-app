'use client';
import { Database } from '@/types_db';

import { File } from 'lucide-react';
import MenuFunctions from './menuFunctions';
import getFavoriteItems from '@/actions/getFavoriteItems';
interface FavoriteProjectsProps {
  projects: Database['public']['Tables']['projects']['Row'][];
  favorito: any;
}

const FavoriteProjects: React.FC<FavoriteProjectsProps> = ({
  projects,
  favorito,
}) => {
  const itemStyle =
    'flex items-center group cursor-pointer gap-3  hover:bg-[#2C2C2C]  transition duration-100 rounded-sm py-2 mx-1 px-2 justify-between ';

  return (
    <div className=''>
      <h2 className='text-xs opacity-60  font-medium mb-2'>Favorites</h2>

      {favorito?.map((project: any) => (
        <div className={`${itemStyle} text-sm relative `} key={project.id}>
          <p className='gap-2 flex truncate'>
            {project?.emoji ? (
              <span className='h-[15px] text-sm'>{project?.emoji}</span>
            ) : (
              <File width={15} height={15} />
            )}
            {project.name}
          </p>
          <MenuFunctions project={project} projects={projects} />
        </div>
      ))}
    </div>
  );
};

export default FavoriteProjects;
