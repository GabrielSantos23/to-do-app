'use client';

import { useKBar } from 'kbar';
import { Search } from 'lucide-react';

interface KbarButtonProps {}

const KbarButton: React.FC<KbarButtonProps> = ({}) => {
  const { query } = useKBar();
  return (
    <div
      className='opacity-80 flex w-full h-full  items-center cursor-pointer gap-3 '
      onClick={query.toggle}
    >
      <Search width={15} height={15} />
      <p className='text-[13px] font-medium'>Search</p>
    </div>
  );
};

export default KbarButton;
