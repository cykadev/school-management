'use client';

import { User, UserStatus } from '@/lib/graphql/__generated__/graphql';
import { GET_USERS } from '@/lib/graphql/queries';
import { useQuery } from 'urql';

export default function Home() {

  const [{ data, fetching, error }] = useQuery({
    query: GET_USERS,
    variables: { status: UserStatus.Active }
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {/* Access data.users; `user` is automatically typed as User */}
      {data?.users?.map((user: User) => (
        <li key={user.id}>
          {user.firstName} {user.lastName}
        </li>
      ))}
    </ul>
  );
}