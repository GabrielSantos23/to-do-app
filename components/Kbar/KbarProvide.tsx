import { Action, KBarProvider } from 'kbar';

import { ProjectCard } from './CardKbar';
import getProjectsByOrder from '@/actions/getProjectsByOrder';
import KbarProviderComponent from './KbarProviderComponent';

const KbarProvider = async ({ children }: { children: React.ReactNode }) => {
  const projects = await getProjectsByOrder();

  return (
    <KbarProviderComponent>
      {projects?.map((project) => (
        //@ts-ignore
        <ProjectCard key={project.id} project={project} />
      ))}

      {children}
    </KbarProviderComponent>
  );
};

export default KbarProvider;
