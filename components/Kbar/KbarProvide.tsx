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
import { Card } from './CardKbar';
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

  const actions: Action[] = [
    {
      id: 'homeAction',
      name: 'Home',
      shortcut: ['h'],
      keywords: 'back',
      section: 'Navigation',
      perform: () => {},
      icon: <FaHome className='w-6 h-6 mx-3' />,
      subtitle: 'Subtitles can help add more context.',
    },
    {
      id: 'docsAction',
      name: 'Docs',
      shortcut: ['g', 'd'],
      keywords: 'help',
      section: 'Navigation',
      icon: <FaBook className='w-6 h-6 mx-3' />,
      perform: () => {},
    },
    {
      id: 'contactAction',
      name: 'Contact',
      shortcut: ['c'],
      keywords: 'email hello',
      section: 'Navigation',
      icon: <FaPhoneAlt className='w-6 h-6 mx-3' />,
      perform: () => {},
    },
    {
      id: 'twitterAction',
      name: 'Twitter',
      shortcut: ['g', 't'],
      keywords: 'social contact dm',
      section: 'Navigation',
      icon: <FaTwitter className='w-6 h-6 mx-3' />,
      perform: () => {},
    },
    {
      id: 'githubAction',
      name: 'Github',
      shortcut: ['g', 'h'],
      keywords: 'sourcecode',
      section: 'Navigation',
      icon: <FaGithub className='w-6 h-6 mx-3' />,
      perform: () => {},
    },
    {
      id: 'blog',
      name: 'Search Blogs',
      shortcut: ['?'],
      keywords: 'serach articles',
      icon: <FaSearch className='w-6 h-6 mx-3' />,
    },
    {
      id: 'theme',
      name: 'Change theme…',
      keywords: 'interface color dark light',
      section: 'Preferences',
      icon: <FaRegSun className='w-6 h-6 mx-3' />,
    },
    {
      id: 'darkTheme',
      name: 'Dark',
      keywords: 'dark theme',
      section: 'Preferences',
      perform: () => {},
      icon: <FaMoon className='w-6 h-6 mx-3' />,
      parent: 'theme',
    },
    {
      id: 'lightTheme',
      name: 'Light',
      keywords: 'light theme',
      section: 'Preferences',
      perform: () => {},
      icon: <FaSun className='w-6 h-6 mx-3' />,
      parent: 'theme',
    },
  ];

  return (
    <KBarProvider actions={actions}>
      {projects.map((project) => (
        <Card key={project.id} project={project} />
      ))}

      {children}
    </KBarProvider>
  );
};

export default KbarProvider;
