'use client';

import useAuthModal from '@/hooks/useAuthModal';
import { useUser } from '@/hooks/useUser';
import { Database } from '@/types_db';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import Modal from '../Modal';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import useUploadModal from '@/hooks/useUploadModal';
import { Button } from '../ui/Button';

interface ProjectsNavbarProps {
  className: string;
  projects: Database['public']['Tables']['projects']['Row'][];
}

const ProjectsNavbar: React.FC<ProjectsNavbarProps> = ({ className }) => {
  const { supabaseClient } = useSessionContext();
  const uploadModal = useUploadModal();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      description: '',
      columns: [
        { name: 'To Do' },
        { name: 'In Progress' },
        { name: 'Under Review' },
        { name: 'Ready' },
      ],
    },
  });
  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const authModal = useAuthModal();
  const { user } = useUser();
  const router = useRouter();

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const { error: ProjectError } = await supabaseClient
        .from('projects')
        .insert({
          user_id: user?.id,
          name: values.name,
          description: values.description,
          slug: `${values.name}-${user?.id}`,
          columns: [
            { name: 'To Do' },
            { name: 'In Progress' },
            { name: 'Under Review' },
            { name: 'Ready' },
          ],
        });
      if (ProjectError) {
        setIsLoading(false);
        return console.error(ProjectError.message);
      }
      router.refresh();
      console.log(`Project Created successfully`);
      reset();
      uploadModal.onClose();
    } catch (error) {
      console.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const onClick = () => {
    if (!user) {
      return authModal.onOpen();
    }
    return uploadModal.onOpen();
  };

  return (
    <>
      <div className=' flex flex-col   '>
        <Plus width={15} height={15} onClick={onClick} className={className} />

        {/* Modal */}
        <Modal
          isOpen={uploadModal.isOpen}
          onChange={onChange}
          title='Create a New To-Do'
          description=''
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-white'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              {...register('name', { required: true })}
              className='mt-1 p-2 w-full border-gray-300 rounded-md focus:ring focus:ring-blue-200'
              maxLength={30}
            />

            <label
              htmlFor='description'
              className='block text-sm font-medium text-white mt-4'
            >
              Description
            </label>
            <textarea
              id='description'
              {...register('description')}
              className='mt-1 p-2 w-full border-gray-300 rounded-md focus:ring focus:ring-blue-200'
            />

            <Button
              isLoading={isLoading}
              type='submit'
              className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600'
            >
              Create Project
            </Button>
          </form>
        </Modal>
      </div>
    </>
  );
};

export { ProjectsNavbar };
