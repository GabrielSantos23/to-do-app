import { Database } from '@/types_db';
import { File } from 'lucide-react';
import MenuFunctions from '../Navbar/menuFunctions';

interface FavoritesMobileProps {
  projects: Database['public']['Tables']['projects']['Row'][];
  favorito: any;
}

const FavoritesMobile: React.FC<FavoritesMobileProps> = ({
  favorito,
  projects,
}) => {
  return (
    <div>
      <h2 className='text-white/20 font-bold py-2 px-4'>favorites</h2>

      {favorito?.map((project: any) => (
        <div
          className={` text-sm px-2 relative flex w-full h-[40px] border-b items-center border-stone-500/50 justify-between `}
          key={project.id}
        >
          <p className='gap-2 flex truncate text-xl items-center text-white/50'>
            {project?.emoji ? (
              <span className='text-white'>{project?.emoji}</span>
            ) : (
              <File className='text-white' width={20} height={20} />
            )}
            {project.name}
          </p>
          <MenuFunctions project={project} projects={projects} />
        </div>
      ))}
    </div>
  );
};

export default FavoritesMobile;
