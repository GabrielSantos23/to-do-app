'use client';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { TooltipTrigger } from './ui/tooltip';
import { Settings, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';

export function SettingsPage() {
  const { user } = useUser();
  const fullName = user?.user_metadata.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TooltipTrigger
          className={` cursor-pointer   hover:bg-[#2C2C2C] w-full transition duration-100 rounded-sm px-4 py-2  `}
        >
          <div
            className={` -mt-1 opacity-80 flex items-center cursor-pointer gap-3 `}
          >
            <Settings width={15} height={15} />
            <p className='text-[13px] font-medium'>Settings</p>
          </div>
        </TooltipTrigger>
      </DialogTrigger>
      <DialogContent className='md:max-w-[900px] bg-[#202020] px-10 '>
        <DialogHeader>
          <DialogTitle className='mb-2 text-base'>My profile</DialogTitle>
          <Separator className='bg-white opacity-20 ' />
        </DialogHeader>
        <div className='flex gap-5'>
          <div className='relative w-[60px] group cursor-pointer'>
            <Image
              className='rounded-full'
              width={60}
              height={60}
              src={user?.user_metadata.picture || '/placeholder.jpeg'}
              alt={`${user?.user_metadata.full_name}-profile-image`}
            />
            <div className='absolute group-hover:flex hidden top-0 right-0 h-4 w-4 bg-[#272727]  text-opacity-50 text-white  items-center justify-center rounded-full'>
              <X size={15} />
            </div>
          </div>
          <div>
            <Label className='opacity-50 text-xs '>Preferred name</Label>
            <Input className='h-7 bg-[#2C2C2C] rounded' value={fullName} />
          </div>
        </div>
        <div>
          <DialogTitle className='mt-5 mb-2 text-base'>
            Account security
          </DialogTitle>
          <Separator className='bg-white opacity-20 ' />
          <div className='mt-3 flex justify-between'>
            {/* change email */}
            <div>
              <Label className=' '>Email</Label>
              <p className='opacity-50 text-xs '>{user?.email}</p>
            </div>
            <Button className='bg-transparent rounded w-30 border border-white border-opacity-10 hover:bg-[#2C2C2C] h-8 text-xs text-white'>
              Change Email
            </Button>
          </div>
          {/* change password */}
          <div className='mt-3 flex justify-between'>
            {/* change email */}
            <div className='mt-2'>
              <Label className=' '>Password</Label>
              <p className='opacity-50 text-xs '>
                Set a permanent password to login to your account.
              </p>
            </div>
            <Button className='bg-transparent rounded w-30 border border-white border-opacity-10 hover:bg-[#2C2C2C] h-8 text-xs text-white'>
              Change Password
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
