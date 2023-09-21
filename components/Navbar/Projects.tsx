import getProjectsByOrder from '@/actions/getProjectsByOrder';

const Projects = async ({}) => {
  const projects = await getProjectsByOrder();

  return projects;
};

export default Projects;
