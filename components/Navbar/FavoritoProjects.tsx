'use client';

import React, { useEffect, useState } from 'react';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';
import { itemStyle } from './ProjectList';
import { File } from 'lucide-react';
import MenuFunctions from './menuFunctions';
interface FavoriteProjectsProps {
  projects: Database['public']['Tables']['projects']['Row'][];
  setProjects: React.Dispatch<
    React.SetStateAction<Database['public']['Tables']['projects']['Row'][]>
  >;
  setIsCreatingProject: React.Dispatch<React.SetStateAction<boolean>>;
}

const FavoriteProjects: React.FC<FavoriteProjectsProps> = ({
  projects,
  setProjects,
  setIsCreatingProject,
}) => {
  const { supabaseClient } = useSessionContext();
  const [favoriteProjects, setFavoriteProjects] = useState<any>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchFavoriteProjects = async () => {
      const { data: fetchedProjects, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('order')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Erro ao buscar projetos:', error);
        return;
      }

      const favoriteProjects = fetchedProjects.filter(
        (project) => project.favorito
      );

      setFavoriteProjects(favoriteProjects);
    };

    fetchFavoriteProjects();
  }, [supabaseClient, projects, user]);

  if (favoriteProjects.length === 0) {
    return null;
  }

  return (
    <div className=''>
      <h2 className='text-xs opacity-60  font-medium mb-2'>Favorites</h2>

      {favoriteProjects.map((project: any) => (
        <div className={`${itemStyle} text-sm relative `} key={project.id}>
          <p className='gap-2 flex truncate'>
            {project?.emoji ? (
              <span className='h-[15px] text-sm'>{project?.emoji}</span>
            ) : (
              <File width={15} height={15} />
            )}
            {project.name}
          </p>
          <MenuFunctions
            project={project}
            projects={projects}
            setIsCreatingProject={setIsCreatingProject}
            setProjects={setProjects}
          />
        </div>
      ))}
    </div>
  );
};

export default FavoriteProjects;
