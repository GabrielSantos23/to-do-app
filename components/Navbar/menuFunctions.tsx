'use client';

import {
  Copy,
  File,
  FolderEdit,
  Link,
  MoreHorizontal,
  Star,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
} from '../ui/Dialog';
import { Button } from '../ui/Button';

import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { Database } from '@/types_db';
import { useSessionContext } from '@supabase/auth-helpers-react';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  DividerProps,
} from '@chakra-ui/react';

import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

import { Input } from '../ui/Input';
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

const newId = uuidv4();
interface menuFunctionsProps {
  projects: Database['public']['Tables']['projects']['Row'][];
  setProjects: React.Dispatch<
    React.SetStateAction<Database['public']['Tables']['projects']['Row'][]>
  >;
  setIsCreatingProject: React.Dispatch<React.SetStateAction<boolean>>;
  project: any;
}

const MenuFunctions: React.FC<menuFunctionsProps> = ({
  projects,
  setProjects,
  project,
  setIsCreatingProject,
}) => {
  const { supabaseClient } = useSessionContext();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [renamingProjectId, setRenamingProjectId] = useState<string | null>(
    null
  );
  const [newProjectName, setNewProjectName] = useState<string>('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (projectId: string) => {
    setIsLoading(true);

    if (isFavorite) {
      const { error } = await supabaseClient
        .from('projects')
        .update({ favorito: false })
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error removing project from favorites:', error.message);
      } else {
        setIsFavorite(false);
        setIsLoading(false);

        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === projectId ? { ...p, favorito: false } : p
          )
        );
      }
    } else {
      const { error } = await supabaseClient
        .from('projects')
        .update({ favorito: true })
        .eq('id', projectId)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error adding project to favorites:', error.message);
      } else {
        setIsFavorite(true);
        setIsLoading(false);

        setProjects((prevProjects) =>
          prevProjects.map((p) =>
            p.id === projectId ? { ...p, favorito: true } : p
          )
        );
      }
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const saveRenamedProject = async () => {
    if (!renamingProjectId) return;

    const { error } = await supabaseClient
      .from('projects')
      .update({ name: newProjectName })
      .eq('id', renamingProjectId)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error renaming project:', error.message);
    } else {
      // Update the local state
      setProjects((prevProjects) =>
        prevProjects.map((p) =>
          p.id === renamingProjectId ? { ...p, name: newProjectName } : p
        )
      );

      // Finish renaming
      setRenamingProjectId(null);
      setNewProjectName('');
    }
  };

  const handleRenameFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveRenamedProject();
  };

  const handleDeleteProject = async (projectId: string) => {
    setIsLoading(true);

    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error deleting project:', error.message);
      setIsLoading(false);
      return;
    }

    setProjects((prevProjects) =>
      prevProjects.filter((p) => p.id !== projectId)
    );
    handleCloseModal();

    setIsLoading(false);
  };

  const duplicateProject = async (projectId: string) => {
    setIsLoading(true);
    setIsCreatingProject(true);
    const { data: originalProjectData, error: originalProjectError } =
      await supabaseClient
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (originalProjectError) {
      console.error(
        'Error fetching original project data:',
        originalProjectError.message
      );
      setIsLoading(false);
      return;
    }

    const duplicatedProject = {
      ...originalProjectData,
      id: newId,
      name: `${originalProjectData.name} (Copy)`,
    };

    const { data: insertedProjectData, error: insertProjectError } =
      await supabaseClient
        .from('projects')
        .insert([duplicatedProject])
        .single();

    if (insertProjectError) {
      console.error(
        'Error inserting duplicated project:',
        insertProjectError.message
      );
      setIsLoading(false);
    } else {
      router.refresh();

      setProjects((prevProjects) => [...prevProjects, insertedProjectData]);
      setIsLoading(false);
      setIsCreatingProject(false);
    }
  };
  const startRenaming = (projectId: string) => {
    const projectToRename = projects.find(
      (project) => project.id === projectId
    );

    if (projectToRename) {
      setRenamingProjectId(projectId);
      setNewProjectName(projectToRename.name);
    }
  };

  const cancelRenaming = () => {
    setRenamingProjectId(null);
    setNewProjectName('');
  };
  const formatCreatedAt = (createdAt: string) => {
    if (!createdAt) return '';

    const [timePart, offsetPart] = createdAt.split('+');
    const [time, microseconds] = timePart.split('.');
    const offset = `+${offsetPart}`;

    const timeDate = new Date(`1970-01-01T${time}Z`);

    const formattedTime = format(timeDate, 'HH:mm:ss');

    return `${formattedTime}${offset}`;
  };

  const handleEmojiClick = async (emoji: any) => {
    setIsEmojiPickerOpen(false);

    const { error } = await supabaseClient
      .from('projects')
      .update({ emoji })
      .eq('id', project.id)
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error updating emoji:', error.message);
    } else {
      setProjects((prevProjects) =>
        prevProjects.map((p) => (p.id === project.id ? { ...p, emoji } : p))
      );
    }
  };

  return (
    <>
      <Menu>
        <MenuButton
          transition='all 0.2s'
          borderRadius='2xl'
          _hover={{ bgColor: '#313131' }}
          p={5}
        >
          <MoreHorizontal height={15} width={15} />
        </MenuButton>
        <MenuList
          bgColor='#252525'
          css={{
            borderRadius: '5px',
            width: '300px',
            backgroundColor: '#252525',
          }}
          pl={10}
          py={10}
          zIndex={100}
        >
          <MenuItem {...menuItemStyle} onClick={() => handleSubmit(project.id)}>
            {project?.favorito ? (
              <>
                <Star width={15} height={15} color='#FFD700' />
                Remove from Favorites
              </>
            ) : (
              <>
                <Star width={15} height={15} /> Add to Favorites
              </>
            )}
          </MenuItem>

          <MenuItem
            {...menuItemStyle}
            onClick={() => duplicateProject(project.id)}
          >
            <Copy width={15} height={15} /> Duplicate
          </MenuItem>
          <MenuItem {...menuItemStyle}>
            <Link width={15} height={15} /> Copy Link
          </MenuItem>
          <MenuItem
            {...menuItemStyle}
            onClick={() => {
              startRenaming(project.id);
            }}
          >
            <FolderEdit width={15} height={15} /> Rename
          </MenuItem>
          <MenuDivider {...dividerStyle} />
          <MenuItem {...menuItemStyle} onClick={handleOpenModal}>
            <Trash2 width={15} height={15} /> Trash
          </MenuItem>

          {isModalOpen && (
            <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
              <DialogContent className='bg-[#202020] border-none shadow-md max-w-xs flex flex-col items-start'>
                <DialogHeader>
                  <DialogDescription className='text-center'>
                    Are you sure you want to delete this project?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className='flex   sm:flex-col  gap-5 w-full sm:space-x-0'>
                  <Button
                    onClick={() => handleDeleteProject(project.id)}
                    className='w-full border outline-none border-red-500 rounded-sm bg-red-500 bg-opacity-10 hover:bg-red-500 hover:bg-opacity-10 text-red-500'
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={handleCloseModal}
                    className='w-full outline-none  border bg-transparent rounded-sm '
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          <MenuDivider {...dividerStyle} />
          <p className='opacity-60 px-5 text-xs mt-3'>
            Created at:{' '}
            {project?.created_at ? formatCreatedAt(project.created_at) : ''}
          </p>
        </MenuList>
      </Menu>

      <div className='absolute top-20 '>
        {isEmojiPickerOpen && (
          <EmojiPicker
            theme={Theme.DARK}
            emojiStyle={EmojiStyle.NATIVE}
            onEmojiClick={(emojiObject, event) => {
              handleEmojiClick(emojiObject.emoji), cancelRenaming();
            }}
          />
        )}
      </div>

      {renamingProjectId === project?.id && (
        <form
          className='absolute flex  items-center gap-2 top-8 bg-[#252525] rounded shadow-md px-2 py-2 z-[100]'
          onSubmit={handleRenameFormSubmit}
        >
          <div
            onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            className='p-1.5 rounded border border-gray-300 border-opacity-30 cursor-pointer bg-[#313131]'
          >
            {project?.emoji ? (
              <span className='h-[15px] text-sm'>{project.emoji}</span>
            ) : (
              <File width={15} height={15} />
            )}
          </div>
          <Input
            type='text'
            required
            className='bg-[#313131] h-7 rounded border-none outline-0 outline-none md:w-[300px] w-[150px] '
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            style={{ zIndex: 1 }}
          />
        </form>
      )}
    </>
  );
};

export default MenuFunctions;

const menuItemStyle = {
  px: 20,
  py: 5,
  _hover: { bg: '#313131' },
  fontSize: 13,
  alignItems: 'center',
  gap: 5,
  css: {
    borderRadius: '2px',
  },
  ml: -5,
  mr: -5,
};

const dividerStyle: DividerProps = {
  borderColor: '#383838',
  borderWidth: '0.5px',
  marginY: '2',
};
