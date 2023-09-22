import getFavoriteItems from '@/actions/getFavoriteItems';
import getProjectsByOrder from '@/actions/getProjectsByOrder';
import Kbar from '@/components/Kbar/Kbar';
import KbarProvider from '@/components/Kbar/KbarProvide';
import Navbar from '@/components/Navbar/Navbar';
import { Toaster } from '@/components/ui/toaster';
import ModalProvider from '@/providers/ModalProvider';

interface LayoutComponentProps {
  children: React.ReactNode;
}

const LayoutComponent: React.FC<LayoutComponentProps> = async ({
  children,
}) => {
  const favorito = await getFavoriteItems();

  const projects = await getProjectsByOrder();

  return (
    <>
      <KbarProvider>
        <Kbar />
        <ModalProvider />
        <Toaster />
        <Navbar projects={projects} favorito={favorito} />
        {children}
      </KbarProvider>
    </>
  );
};

export default LayoutComponent;
