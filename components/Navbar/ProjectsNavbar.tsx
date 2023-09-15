'use client';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { File, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { twMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';
import Modal from '../Modal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
interface ProjectsNavbarProps {
  className: string;
  projects: Database['public']['Tables']['projects']['Row'][];
  setProjects: React.Dispatch<
    React.SetStateAction<Database['public']['Tables']['projects']['Row'][]>
  >;
  setIsCreatingProject: React.Dispatch<React.SetStateAction<boolean>>;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

const ProjectsNavbar: React.FC<ProjectsNavbarProps> = ({
  className,
  projects,
  setProjects,
  setIsCreatingProject,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { supabaseClient } = useSessionContext();

  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    columns: [
      { name: 'To Do' },
      { name: 'In Progress' },
      { name: 'Under Review' },
      { name: 'Ready' },
    ],
  });

  const authModal = useAuthModal();
  const { user } = useUser();
  const router = useRouter();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProjectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCreateProject = async () => {
    const { name, description, columns } = projectData;
    const slug = slugify(name);

    if (!user) {
      console.error('Usuário não autenticado. Não é possível criar o projeto.');
      return;
    }

    if (!name) {
      console.error('O nome do projeto é obrigatório.');
      return;
    }

    setIsCreatingProject(true);

    const newProject = {
      user_id: user.id,
      name,
      description,
      columns: columns.map((column, index) => ({
        name: column.name,
      })),
      slug: `${slug}-${user.id}`,
      order: 0,
    };

    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .insert([newProject])
        .single();

      if (error) {
        throw error;
      }

      setProjects((prevProjects: any) => [...prevProjects, data]);
      closeModal();
      setProjectData({
        name: '',
        description: '',
        columns: [
          { name: 'To Do' },
          { name: 'In Progress' },
          { name: 'Under Review' },
          { name: 'Ready' },
        ],
      });
    } catch (error) {
      console.error('Erro ao criar o projeto:', error);
    } finally {
      setIsCreatingProject(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    handleCreateProject();
    router.refresh();
  };

  const validateLogin = user ? openModal : authModal.onOpen;

  return (
    <>
      <div className=' flex flex-col   '>
        <button className='' onClick={validateLogin}>
          <Plus width={15} height={15} className={className} />
        </button>

        {/* Modal */}
        {isModalOpen && (
          <Modal
            isOpen={isModalOpen} // Passa o estado de abertura do modal
            onChange={closeModal} // Passa a função para fechar o modal
            title='Create a New To-Do'
            description=''
          >
            <form onSubmit={handleSubmit}>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-white'
              >
                Name
              </label>
              <input
                type='text'
                id='name'
                name='name'
                value={projectData.name}
                onChange={handleInputChange}
                className='mt-1 p-2 w-full border-gray-300 rounded-md focus:ring focus:ring-blue-200'
              />

              <label
                htmlFor='description'
                className='block text-sm font-medium text-white mt-4'
              >
                Description
              </label>
              <textarea
                id='description'
                name='description'
                value={projectData.description}
                onChange={handleTextareaChange}
                className='mt-1 p-2 w-full border-gray-300 rounded-md focus:ring focus:ring-blue-200'
              />

              {projectData.columns.map((column, index) => (
                <div key={index} className='mt-4'>
                  <label className='block text-sm font-medium text-white'>
                    {column.name}
                  </label>
                </div>
              ))}

              <button
                type='submit'
                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
              >
                Create Project
              </button>
            </form>
          </Modal>
        )}
      </div>
    </>
  );
};

export { ProjectsNavbar };
