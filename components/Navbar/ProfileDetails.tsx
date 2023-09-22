'use client';

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import useLoadImage from '@/hooks/useLoadImage';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProfileDetailsProps {}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({}) => {
  const { supabaseClient } = useSessionContext();
  const router = useRouter();
  const { user, userDetails } = useUser();
  const loadImage = useLoadImage(userDetails);

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      console.log(error);
    }

    router.refresh();
  };

  if (!user) {
    return null;
  }

  const fullName = user?.user_metadata.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';

  return (
    <div className='bg-[#252525]'>
      <DropdownMenuLabel>
        <div className='flex justify-between px-2 '>
          <p className='text-[10px] opacity-60'>{user?.email}</p>
        </div>
        <div className='flex p-2 gap-2 items-center  '>
          <div className='max-w-[35px] max-h-[35px] rounded '>
            <Image
              className=''
              width={35}
              height={35}
              src={loadImage || '/placeholder.jpeg'}
              alt={`${user?.user_metadata.full_name}-profile-image`}
            />
          </div>
          <div>
            <p className='text-xs'> {userDetails?.full_name}&apos;s List </p>
            <p className='text-[10px] font-normal opacity-60'> Free Plan </p>
          </div>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem className='text-xs opacity-60'>
          Profile Settings
        </DropdownMenuItem>
        <DropdownMenuItem className='text-xs opacity-60' onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem className='text-xs opacity-60'>
          Get Desktop App
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </div>
  );
};

export default ProfileDetails;
