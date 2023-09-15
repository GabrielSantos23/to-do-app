import Link from 'next/link';
import React from 'react';
import { useRegisterActions } from 'kbar';
import { useRouter } from 'next/navigation';
import { Database } from '@/types_db';
import { File } from 'lucide-react';

// Card component
export const ProjectCard = ({ project }: { project: any }) => {
  // router
  const router = useRouter();

  function getFirstLetter(name: string) {
    // Verifica se a string não está vazia e se é uma string
    if (typeof name === 'string' && name.length > 0) {
      return name[0].toUpperCase(); // Retorna a primeira letra em maiúsculas
    }
    return ''; // Retorna uma string vazia se a entrada for inválida
  }
  const firstLetter = getFirstLetter(project.name);
  // Register Action
  useRegisterActions([
    {
      id: project.id,
      name: project.name,
      keywords: project.name,
      shortcut: [firstLetter],
      perform: () => router.push(project.slug),

      icon: project.emoji || <File width={18} height={18} />,
      subtitle: project.description,
    },
  ]);
};
