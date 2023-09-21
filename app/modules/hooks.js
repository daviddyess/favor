import { useContext } from 'react';
import { UserContext } from '~/modules/context';

export const useCurrentUser = () => useContext(UserContext);

const hooks = {
  useCurrentUser
};

export default hooks;
