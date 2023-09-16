'use client';

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import useNameModal from '@/hooks/useNameModal';
import { useEffect, useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { toast } from 'react-hot-toast';
import { FieldValues, useForm, SubmitHandler } from 'react-hook-form';

import uniqid from 'uniqid';
// import SubscribeModal from './SubscribeModal';
import { ProductWithPrice } from '@/types';
import Modal from '../Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ModalProviderProps {
  products: ProductWithPrice[];
}

const NameModal: React.FC<ModalProviderProps> = ({ products }) => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const { session } = useSessionContext();
  const { onClose, isOpen } = useNameModal();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      if (!user) {
        toast.error('Missing Fields');
        return;
      }

      const { title, image } = values;
      const imageFile = image?.[0];

      if (imageFile) {
        const uniqueID = uniqid();

        const { data: imageData, error: imageError } =
          await supabaseClient.storage
            .from('Profile_Image')
            .upload(`image-${title}-${uniqueID}`, imageFile, {
              cacheControl: '3600',
              upsert: false,
            });

        if (imageError) {
          setIsLoading(false);
          return toast.error('Failed image upload.');
        }

        await supabaseClient
          .from('users')
          .update({
            full_name: title,
            avatar_url: imageData.path,
          })
          .eq('id', user.id);
      } else {
        await supabaseClient
          .from('users')
          .update({
            full_name: title,
          })
          .eq('id', user.id);
      }

      router.refresh();
      toast.success('Name updated successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error('Something went wrong');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      router.refresh();
      onClose();
    }
  }, [session, router, onClose]);

  return (
    <Modal
      title='Set your name'
      description='to see your profile set your name'
      onChange={onChange}
      isOpen={isOpen}
    >
      <form className='flex flex-col gap-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='pb-1'>Add your name</div>
        <Input
          id='title'
          disabled={isLoading}
          {...register('title', { required: true })}
        />
        <div className='pb-1'>Select a profile image</div>

        <Input
          id='image'
          type='file'
          accept='image/*'
          disabled={isLoading}
          {...register('image')}
        />
        <Button
          className='bg-sky-500 text-white '
          disabled={isLoading}
          type='submit'
        >
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default NameModal;
