import { UserDetails } from '@/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';

const useLoadImage = (user: UserDetails | null) => {
  const supabaseClient = useSupabaseClient();

  if (!user || !user.avatar_url) {
    return null;
  }

  const { data: imageData } = supabaseClient.storage
    .from('Profile_Image')
    .getPublicUrl(user.avatar_url as string);

  return imageData?.publicUrl;
};

export default useLoadImage;
