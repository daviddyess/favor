import useMatchesData from '~/hooks/useMatchesData';
import type { User } from '#/User';

function isUser(user: any): user is User {
  return user && typeof user === 'object' && typeof user.id === 'string';
}

export default function useUser(): User | undefined {
  const data = useMatchesData('root');
  if (!data || !isUser(data.user)) {
    return {
      isLoggedIn: false,
      username: 'Guest',
      avatar: { sm: null, md: null, lg: null }
    };
  }
  return data.user;
}
