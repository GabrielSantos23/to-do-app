'use client';

import {
  AiOutlineInstagram,
  AiFillGithub,
  AiFillBehanceCircle,
  AiFillLinkedin,
} from 'react-icons/ai';
import { FiCode } from 'react-icons/fi';
import { KBarProvider } from 'kbar';

export interface KBarAction {
  id: string;
  name: string;
  shortcut?: string[];
  keywords?: string;
  perform?: () => void;
  children?: KBarAction[];
  icon?: JSX.Element;
  title?: string;
  url?: string;
}

export const actions: KBarAction[] = [
  {
    id: 'home',
    name: 'Home',
    shortcut: ['h'],
    keywords: 'email',
    perform: () => (window.location.pathname = '/'),
  },
  {
    id: 'about',
    name: 'About',
    shortcut: ['a'],
    keywords: 'email',
    perform: () => (window.location.pathname = 'about'),
  },
  {
    id: 'projects',
    name: 'Projects',
    shortcut: ['p'],
    keywords: 'writing words',
    perform: () => (window.location.pathname = 'projects'),
  },
  {
    id: 'contact',
    name: 'Contact',
    shortcut: ['c'],
    keywords: 'email',
    perform: () => (window.location.pathname = 'contact'),
  },
  {
    id: 'resume',
    name: 'Resume',
    shortcut: ['r'],
    keywords: 'email',
    perform: () => (window.location.pathname = 'resume'),
  },
  {
    id: '',
    name: '',
    title: 'Socials',
  },
  {
    id: 'instagram',
    name: 'Intagram',
    perform: () => window.open('https://instagram.com/gabriel.santos.ss'),
    icon: <AiOutlineInstagram />,
  },
  {
    id: 'github',
    name: 'GitHub',
    perform: () => window.open('https://github.com/GabrielSantos23'),
    icon: <AiFillGithub />,
  },
  {
    id: 'behance',
    name: 'Behance',
    perform: () => window.open('https://www.behance.net/gabrielsilva398'),
    icon: <AiFillBehanceCircle className='text-blue-500' />,
  },
  {
    id: 'linkedin',
    name: 'Linkedin',
    url: 'https://hashnode.com/@anishde12020',
    perform: () =>
      window.open('https://www.linkedin.com/in/gabriel-santos-ss/'),
    icon: <AiFillLinkedin color='#2962ff' />,
  },
  {
    id: 'sourceCode',
    name: 'Source Code',
    perform: () => window.open('https://www.github.com'),
    icon: <FiCode color='' />,
  },
];

const KbarProvider = ({ children }: { children: React.ReactNode }) => {
  return <KBarProvider actions={actions}>{children}</KBarProvider>;
};

export default KbarProvider;
