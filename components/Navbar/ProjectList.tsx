'use client';

import { useUser } from '@/hooks/useUser';

import { Database } from '@/types_db';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import { File } from 'lucide-react';

import MenuFunctions from './menuFunctions';
import { useRouter } from 'next/navigation';

const itemStyle =
  'flex items-center group cursor-pointer gap-3  hover:bg-[#2C2C2C]  transition duration-100 rounded-sm py-2 mx-1 px-2 justify-between ';

const ProjectList: React.FC<{
  projects: Database['public']['Tables']['projects']['Row'][];
}> = ({ projects }) => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const router = useRouter();

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const updatedProjects = [...projects];
    const [movedProject] = updatedProjects.splice(result.source.index, 1);
    updatedProjects.splice(result.destination.index, 0, movedProject);

    const newProjectOrder = updatedProjects.map((project, index) => ({
      id: project.id,
      order: index,
      user_id: user?.id,
      name: project.name,
    }));

    const { error } = await supabaseClient
      .from('projects')
      .upsert(newProjectOrder, {})
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating project order:', error);
    }
    router.refresh();
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='projectList' direction='vertical'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className=' '
            >
              {projects.map((project, index) => (
                <Draggable
                  key={project?.id}
                  draggableId={project?.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={`${itemStyle} relative`}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      {project ? (
                        <h3
                          className='text-sm flex opacity-80 items-center justify-start gap-2 truncate '
                          style={{ zIndex: 2 }}
                        >
                          {project?.emoji ? (
                            <span className='h-[15px] text-sm'>
                              {project?.emoji}
                            </span>
                          ) : (
                            <File width={15} height={15} />
                          )}
                          {project?.name}
                        </h3>
                      ) : (
                        <span className='w-full h-5 bg-[#1d1d20] rounded-sm animate-pulse'></span>
                      )}
                      <MenuFunctions project={project} projects={projects} />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default ProjectList;
