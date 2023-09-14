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
import { Input } from '../ui/Input';
import { Label } from '../ui/label';
import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { TooltipTrigger } from '../ui/tooltip';

export function Kbar2() {
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 't') {
        // Abra o diálogo
        const dialogTrigger = document.querySelector('.dialog-trigger'); // Substitua com a classe apropriada
        if (dialogTrigger) {
          dialogTrigger.click(); // Simule um clique no DialogTrigger
        }
      }
    };

    // Adicione o ouvinte de evento quando o componente é montado
    document.addEventListener('keydown', handleKeyPress);

    // Remova o ouvinte de evento quando o componente é desmontado
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild className='dialog-trigger'>
        <TooltipTrigger
          className={` cursor-pointer   hover:bg-[#2C2C2C] w-full transition duration-100 rounded-sm px-4 py-2  `}
        >
          <div className='opacity-80 flex w-full h-full  items-center cursor-pointer gap-3 bg-neutral '>
            <Search width={15} height={15} />
            <p className='text-[13px] font-medium'>Search</p>
          </div>
        </TooltipTrigger>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' value='Pedro Duarte' className='col-span-3' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Username
            </Label>
            <Input id='username' value='@peduarte' className='col-span-3' />
          </div>
        </div>
        <DialogFooter>
          <Button type='submit'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
