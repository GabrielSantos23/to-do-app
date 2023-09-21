import getUserInfo from '@/actions/getUserInfo';

const UserDetails = async ({}) => {
  const user: any = await getUserInfo();

  return user;
};

export default UserDetails;
