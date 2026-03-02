import { getAuthClaims } from '../auth.service';

export const useGetAuthClaims = () => {
  return useQuery({
    queryFn: () => getAuthClaims(),
    queryKey: ['auth-user', 'claims'],
  });
};
