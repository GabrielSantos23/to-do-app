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
import { Label } from '@/components/ui/label';
import { useUser } from '@/hooks/useUser';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { Eye, EyeOff, PenLine } from 'lucide-react';
import { useState } from 'react';
import { useToast } from './ui/use-toast';
import { createClient } from '@supabase/supabase-js';
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);
export function ChangePassword() {
  const { userDetails, user } = useUser();
  const { session } = useSessionContext();
  const { toast } = useToast();
  const { supabaseClient } = useSessionContext();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast({
        title: 'New Password and Confirm Password do not match.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const email = user?.email ? user.email : '';
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: currentPassword,
      });

      if (error) {
        toast({
          title: `${error.message}`,
          variant: 'destructive',
        });
      }
      if (!error) {
        const { error: updateError } = await supabase.auth.updateUser({
          password: newPassword,
        });
        console.log(updateError?.message);
        if (updateError) {
          toast({ title: `${updateError.message}`, variant: 'destructive' });
        } else {
          toast({ title: 'Password updated successfully.' });
        }
      }
    } catch (error: any) {
      toast({ title: `${error.msg}` });
    }
  };

  return (
    <DialogContent className='sm:max-w-[350px] bg-[#202020]'>
      <form onSubmit={handleChangePassword}>
        <DialogHeader></DialogHeader>
        <div className='flex items-center justify-center flex-col mb-5'>
          <PenLine />
          <div className='text-sm mt-5 '>
            <h2 className='font-bold text-center mb-1'>Change Password</h2>
            <p className='text-xs text-center opacity-50'>
              Use a password at least 15 letters long, or at least 8 characters
              long with both letters and numbers.
            </p>
            <div className='flex flex-col gap-3 mt-5'>
              <div>
                <Label className='text-xs opacity-50' htmlFor=''>
                  Enter the current password
                </Label>
                <div className='relative'>
                  <Input
                    className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded'
                    placeholder='Current Password'
                    type={showCurrentPassword ? 'text' : 'password'}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {showCurrentPassword ? (
                    <span
                      onClick={() => setShowCurrentPassword(false)}
                      className='absolute  right-2 top-0 cursor-pointer'
                    >
                      {currentPassword && (
                        <EyeOff className='w-[17px] opacity-50' />
                      )}
                    </span>
                  ) : (
                    <span
                      onClick={() => setShowCurrentPassword(true)}
                      className='absolute  right-2 top-0 cursor-pointer'
                    >
                      {currentPassword && (
                        <Eye className='w-[17px] opacity-50' />
                      )}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Label className='text-xs opacity-50  ' htmlFor=''>
                  Enter a new password
                </Label>
                <div className='relative'>
                  <Input
                    className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded'
                    placeholder='New Password'
                    type={showNewPassword ? 'text' : 'password'}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {showNewPassword ? (
                    <span
                      onClick={() => setShowNewPassword(false)}
                      className='absolute right-2 top-0 cursor-pointer'
                    >
                      {newPassword && (
                        <EyeOff className='w-[17px] opacity-50' />
                      )}
                    </span>
                  ) : (
                    <span
                      onClick={() => setShowNewPassword(true)}
                      className='absolute right-2 top-0 cursor-pointer'
                    >
                      {newPassword && <Eye className='w-[17px] opacity-50' />}
                    </span>
                  )}
                </div>
              </div>
              <div className='relative'>
                <Label className='text-xs opacity-50  ' htmlFor=''>
                  Confirm your new password
                </Label>
                <div className='relative'>
                  <Input
                    className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded'
                    placeholder='Confirm Password'
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {showConfirmPassword ? (
                    <span
                      onClick={() => setShowConfirmPassword(false)}
                      className='absolute right-2 top-0 cursor-pointer'
                    >
                      {' '}
                      {confirmPassword && (
                        <EyeOff className='w-[17px] opacity-50' />
                      )}
                    </span>
                  ) : (
                    <span
                      onClick={() => setShowConfirmPassword(true)}
                      className='absolute right-2 top-0 cursor-pointer'
                    >
                      {' '}
                      {confirmPassword && (
                        <Eye className='w-[17px] opacity-50' />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            className='w-full bg-[#0077D4] hover:bg-[#0077f9]'
            type='submit'
          >
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
