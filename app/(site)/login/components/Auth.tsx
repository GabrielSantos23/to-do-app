'use client';

import {
  useSessionContext,
  useSupabaseClient,
} from '@supabase/auth-helpers-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { Auth } from '@supabase/auth-ui-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthComponent = () => {
  const router = useRouter();
  const supabaseClient = useSupabaseClient();
  const { session } = useSessionContext();

  useEffect(() => {
    if (session) {
      router.refresh();
      router.push('/user');
    }
  }, [session, router]);

  return (
    <div className='fixed inset-0 z-[999999] mb-[80px]  lg:mb-0 lg:ml-[100px]'>
      <div className='fixed left-2/4 top-[50%] h-full max-h-full w-full translate-x-[-50%] translate-y-[-50%] rounded-md border-neutral-700 bg-neutral-800 p-[25px] drop-shadow-md focus:outline-none md:h-auto md:max-h-[85vh] md:w-[90vw] md:max-w-[450px]'>
        <div className='mb-4 text-center text-xl font-bold'>Welcome back</div>
        <div className='mb-5 text-center text-sm leading-normal'>
          Login to your account
        </div>
        <Auth
          supabaseClient={supabaseClient}
          magicLink
          providers={['google', 'github']}
          theme='dark'
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#404040',
                  brandAccent: '#0ea5e9',
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default AuthComponent;
