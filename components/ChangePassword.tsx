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
import { PenLine } from 'lucide-react';

export function ChangePassword() {
  const { userDetails } = useUser();

  return (
    <DialogContent className='sm:max-w-[350px] bg-[#202020]'>
      <DialogHeader></DialogHeader>
      <div className='flex items-center justify-center flex-col'>
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
              <Input
                className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded'
                placeholder='Current Passoword 
               '
              />
            </div>
            <div>
              <Label className='text-xs opacity-50  ' htmlFor=''>
                Enter a new password
              </Label>
              <Input
                className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded'
                placeholder='new Password'
              />
            </div>
            <div>
              <Label className='text-xs opacity-50  ' htmlFor=''>
                Confirm your new password
              </Label>
              <Input
                className='bg-[#2C2C2C] h-7 placeholder:opacity-50 rounded '
                placeholder='Confirm Passoword'
              />
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
    </DialogContent>
  );
}
