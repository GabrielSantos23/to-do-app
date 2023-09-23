import getUserInfo from '@/actions/getUserInfo';
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
import { useState } from 'react';
import { supabase } from './ChangePassword';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@supabase/auth-helpers-react';

interface DeleteAccountProps {
  user: any;
  userDetails: any;
}

export function DeleteAccount({ user, userDetails }: DeleteAccountProps) {
  //   const userInfo = await getUserInfo();
  const fullName = userDetails?.full_name;
  const first = fullName ? fullName.split(' ')[0] : '';
  const [isDeleting, setIsDeleting] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const router = useRouter();
  const { supabaseClient } = useSessionContext();

  const handleEmailInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(e.target.value);
  };

  const isEmailDifferent = emailInput !== user.email;

  const handleDeleteAccount = async () => {
    if (isEmailDifferent) {
      toast({
        title:
          "The email doesn't match your account email. Please enter your account email.",
      });
      return;
    }

    try {
      await supabaseClient.from('deletionRequests').insert([
        {
          user_id: user.id,
        },
      ]);

      toast({
        title:
          'Account deletion request submitted successfully. An admin will process your request.',
      });

      router.refresh();
    } catch (error) {
      console.error('Error submitting deletion request:', error.message);
      toast({
        title:
          'An error occurred while processing your request. Please try again later.',
      });
    }
  };

  return (
    <DialogContent className='sm:max-w-[380px] bg-[#202020]'>
      <DialogHeader className='flex flex-col gap-4'>
        <DialogDescription className='text-[15px] text-white/80'>
          This action cannot be undone. This will permanently delete your entire
          account. All private workspaces will be deleted, and you will be
          removed from all shared workspaces.
        </DialogDescription>
        <DialogDescription className='text-red-500 text-[15px]'>
          {first}&apos;s List{' '}
        </DialogDescription>

        <DialogDescription className='text-[15px] text-white/80'>
          Please type in your email to confirm.
        </DialogDescription>
      </DialogHeader>

      <Input
        id='name'
        className=' bg-[#2C2C2C] rounded'
        placeholder={user.email}
        value={emailInput}
        onChange={handleEmailInputChange}
      />

      <DialogFooter>
        <Button
          className='bg-tranparent border text-xs text-red-500 hover:bg-[#352626] border-red-500 w-full'
          type='submit'
          disabled={isEmailDifferent}
          isLoading={isDeleting}
          onClick={handleDeleteAccount}
        >
          Permanently delete account and a workspace.
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
