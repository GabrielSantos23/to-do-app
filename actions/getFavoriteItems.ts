import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const getFavoriteItems = async (): Promise<any[]> => {
  const supabase = createServerComponentClient({
    cookies: cookies,
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data: favoriteItemsData, error: favoriteItemsError } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', sessionData.session?.user.id)
    .eq('favorito', true);

  if (favoriteItemsError) {
    console.log(favoriteItemsError.message);
    return [];
  }

  return favoriteItemsData || [];
};

export default getFavoriteItems;
