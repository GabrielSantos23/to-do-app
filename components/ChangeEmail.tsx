'use client';

import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/Dialog';
import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
import { toast } from './ui/use-toast';
import { supabase } from './ChangePassword';
import { Input } from './ui/Input';
import { Eye, EyeOff } from 'lucide-react';

export function ChangeEmail() {
  const { user } = useUser();
  const [passwordCorrect, setPasswordCorrect] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isloading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const changeEmail = async () => {
    setIsloading(true);
    if (!newEmail) {
      toast({
        title: 'Please add a new email.',
        variant: 'destructive',
      });
      setIsloading(false);

      return;
    }

    try {
      const { user, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) {
        toast({
          title: `${error.message}`,
          variant: 'destructive',
        });
      } else {
        toast({ title: 'Email updated successfully.' });
        // Atualize a interface do usuário ou redirecione para outra página, se necessário
        setPasswordCorrect(false);
        setIsloading(false);
      }
    } catch (error: any) {
      toast({ title: `${error.message}` });
      setIsloading(false);
    }
  };

  const handleChangeEmail = async (e: any) => {
    e.preventDefault();

    if (!passwordInput) {
      toast({
        title: 'Please add a password.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user?.email,
        password: passwordInput,
      });

      if (error) {
        toast({
          title: `${error.message}`,
          variant: 'destructive',
        });
      } else {
        // Password is correct
        setPasswordCorrect(true);
      }
    } catch (error: any) {
      toast({ title: `${error.message}` });
    }
  };

  return (
    <DialogContent className='sm:max-w-[450px] bg-[#191919]'>
      <div className='flex gap-4 py-4 flex-col'>
        <div>
          <p className='text-sm'>
            Your current email is{' '}
            <span className='font-bold'>{user?.email}</span>
          </p>
          <p className='text-sm mt-3'>Please enter your password.</p>
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              className='mt-3 bg-[#2C2C2C] h-[30px] rounded placeholder:text-white/30'
              placeholder='Password'
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
            {showPassword ? (
              <span
                onClick={() => setShowPassword(false)}
                className='absolute right-2 top-1 cursor-pointer'
              >
                {passwordInput && <EyeOff className='w-[17px] opacity-50' />}
              </span>
            ) : (
              <span
                onClick={() => setShowPassword(true)}
                className='absolute right-2 top-1 cursor-pointer'
              >
                {passwordInput && <Eye className='w-[17px] opacity-50' />}
              </span>
            )}
          </div>
        </div>
        {passwordCorrect && (
          <div>
            <p className='text-sm mt-3'>
              Please enter a new email and we will send you a verification code.
            </p>
            <Input
              type='email'
              className='mt-3 bg-[#2C2C2C] h-[30px] rounded placeholder:text-white/30'
              placeholder='Enter new email'
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
        )}
      </div>
      <DialogFooter>
        <Button
          className='w-full h-[30px] bg-[#0077D4]'
          type='submit'
          onClick={passwordCorrect ? changeEmail : handleChangeEmail}
        >
          {passwordCorrect ? 'Change Email' : 'Continue'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
