'use client';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { TooltipTrigger } from './ui/tooltip';
import { ChevronRight, Settings, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';
import toast from 'react-hot-toast';
import uniqid from 'uniqid';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import useLoadImage from '@/hooks/useLoadImage';
import { ChangePassword } from './ChangePassword';
import { useState } from 'react';
import { DeleteAccount } from './DeleteAccount';
import { ChangeEmail } from './ChangeEmail';

const SettingsPage = () => {
  const { user, userDetails } = useUser();
  const supabaseClient = useSupabaseClient();
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();
  const loadImage = useLoadImage(userDetails);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      name: userDetails?.full_name || '',
      image: null,
    },
  });

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

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsloading(true);
      if (!user) {
        toast.error('Missing Fields');
        setIsloading(false);
      }

      const { name, image } = values;
      const imageFile = image?.[0];

      if (imageFile) {
        const uniqueId = uniqid();

        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from('Profile_Image')
            .upload(`image-${name}-${uniqueId}`, imageFile, {
              cacheControl: '3600',
              upsert: false,
            });

        if (imageError) {
          return toast.error('Failed image upload.');
        }
        await supabaseClient
          .from('users')
          .update({ full_name: name, avatar_url: imageData.path })
          .eq('id', user?.id);
      } else {
        await supabaseClient
          .from('users')
          .update({
            full_name: name,
          })
          .eq('id', user?.id);
      }
      router.refresh();
      toast.success('Name updated successfully.');
      reset();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      setIsloading(false);

      window.location.reload();
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-5'>
            <div className='relative w-[60px] group cursor-pointer'>
              <label htmlFor='image' className='cursor-pointer'>
                <Image
                  className='rounded-full bg-white bg-opacity-20'
                  width={60}
                  height={60}
                  src={loadImage || '/placeholder.jpeg'}
                  alt={`${userDetails?.full_name}-profile-image`}
                />

                <div className='absolute group-hover:flex hidden top-0 right-0 h-4 w-4 bg-[#272727]  text-opacity-50 text-white  items-center justify-center rounded-full'>
                  <X size={15} />
                </div>
              </label>
              <input
                type='file'
                id='image'
                accept='image/*'
                className='hidden'
                {...register('image')}
              />
            </div>
            <div>
              <Label className='opacity-50 text-xs '>Preferred name</Label>
              <Input
                className='h-7 bg-[#2C2C2C] rounded'
                id='name'
                defaultValue={userDetails?.full_name}
                {...register('name', { required: true })}
              />
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
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='bg-transparent rounded w-30 border border-white border-opacity-10 hover:bg-[#2C2C2C] h-8 text-xs text-white'>
                    Change Email
                  </Button>
                </DialogTrigger>
                <ChangeEmail />
              </Dialog>
            </div>

            {/* change password */}

            <div className='mt-3 flex justify-between'>
              <div className='mt-2'>
                <Label className=' '>Password</Label>
                <p className='opacity-50 text-xs '>
                  Set a permanent password to login to your account.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='bg-transparent rounded w-30 border border-white border-opacity-10 hover:bg-[#2C2C2C] h-8 text-xs text-white'>
                    Change Password
                  </Button>
                </DialogTrigger>
                <ChangePassword />
              </Dialog>
            </div>
          </div>
          <div className='mt-5'>
            <DialogTitle className='mt-5 mb-2 text-base'>Suporte </DialogTitle>
            <Separator className='bg-white opacity-20 ' />

            {/* log out all devices */}

            <div
              className='flex items-center w-full justify-between group mt-4 cursor-pointer'
              onClick={handleLogout}
            >
              <div>
                <Label>Log out of all devices</Label>
                <p className='opacity-50 text-xs '>
                  Log out of all other active sessions on other devices besides
                  this one.
                </p>
              </div>
              <div className='px-0.5 py-0 hover:bg-[#2C2C2C] rounded'>
                <ChevronRight
                  className='opacity-50 cursor-pointer'
                  width={18}
                />
              </div>
            </div>

            {/* delete acount */}
            <Dialog>
              <DialogTrigger asChild>
                <div className='flex items-center w-full justify-between  mt-4 mb-4 cursor-pointer'>
                  <div>
                    <Label className='text-red-500'>Delete my account</Label>
                    <p className='opacity-50 text-xs '>
                      Permanently delete the account and remove access from all
                      workspaces.
                    </p>
                  </div>
                  <div className='px-0.5 py-0 hover:bg-[#2C2C2C] rounded'>
                    <ChevronRight
                      className='opacity-50 cursor-pointer'
                      width={18}
                    />
                  </div>
                </div>
              </DialogTrigger>
              <DeleteAccount user={user} userDetails={userDetails} />
            </Dialog>
          </div>

          <DialogFooter>
            <Button isLoading={isloading} type='submit'>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPage;
