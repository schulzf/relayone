'use client';

import {useTRPC} from '@/trpc/client';
import {useQuery} from '@tanstack/react-query';

export const HelloWorld = () => {
  const trpc = useTRPC();
  const helloWorldQuery = useQuery(trpc.hello.helloWorld.queryOptions());
  const helloWorldEnrolledUserQuery = useQuery(trpc.hello.helloWorldEnrolledUser.queryOptions());

  return (
    <div>
      <div>
        <strong>Call API No Enrolled User :</strong> {helloWorldQuery.data ?? (helloWorldQuery.error?.message || '')}
      </div>
      <div>
        <strong>Call API Enrolled User :</strong> {helloWorldEnrolledUserQuery.data ?? (helloWorldEnrolledUserQuery.error?.message || '')}
      </div>
    </div>
  );
};
