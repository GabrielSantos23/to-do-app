'use client';

import {
  AiOutlineInstagram,
  AiFillGithub,
  AiFillBehanceCircle,
  AiFillLinkedin,
} from 'react-icons/ai';
import { FiCode } from 'react-icons/fi';
import { KBarProvider } from 'kbar';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { Database } from '@/types_db';

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
  }, [supabaseClient]);

  const projectActions = projects.map((project) => ({
    id: project.id.toString(),
    name: project.name,
    shortcut: [], // Você pode definir atalhos se desejar
    keywords: project.name, // Você pode definir palavras-chave aqui
    perform: () => (window.location.pathname = `project/${project.id}`),
  }));

  const actions = [
    {
      id: 'blog',
      name: 'Blog',
      shortcut: ['b'],
      keywords: 'writing words',
      perform: () => (window.location.pathname = 'blog'),
    },
    {
      id: 'contact',
      name: 'Contact',
      shortcut: ['c'],
      keywords: 'email',
      perform: () => (window.location.pathname = 'contact'),
    },
    ...projectActions,
  ];

  return <KBarProvider actions={actions}>{children}</KBarProvider>;
};

export default KbarProvider;
