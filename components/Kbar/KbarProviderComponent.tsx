'use client';

import { Action, KBarProvider } from 'kbar';

interface KbarProviderComponentProps {
  children: React.ReactNode;
}

const KbarProviderComponent: React.FC<KbarProviderComponentProps> = ({
  children,
}) => {
  const actions: Action[] = [];

  return <KBarProvider actions={actions}>{children}</KBarProvider>;
};
export default KbarProviderComponent;
