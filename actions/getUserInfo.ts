import { UserInfo } from '@/types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getUserInfo = async (): Promise<UserInfo[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', sessionData.session?.user.id)
    .single();

  if (userError) {
    console.log(userError.message);
    return [];
  }

  return userData || null;
};

export default getUserInfo;
