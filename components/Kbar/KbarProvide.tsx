'use client';

import {
  FaHome,
  FaBook,
  FaPhoneAlt,
  FaTwitter,
  FaGithub,
  FaSearch,
  FaRegSun,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import { FiCode } from 'react-icons/fi';
import { Action, KBarProvider } from 'kbar';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { Database } from '@/types_db';
import { useRegisterActions } from 'kbar';
import { ProjectCard } from './CardKbar';
const KbarProvider = ({ children }: { children: React.ReactNode }) => {
  const { supabaseClient } = useSessionContext();
  const { user } = useUser();
  const [projects, setProjects] = useState<
    Database['public']['Tables']['projects']['Row'][]
  >([]);

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
  }, [supabaseClient, user]);

  const actions: Action[] = [];

  return (
    <KBarProvider actions={actions}>
      {projects.map((project) => (
        //@ts-ignore
        <ProjectCard key={project.id} project={project} />
      ))}

      {children}
    </KBarProvider>
  );
};

export default KbarProvider;
