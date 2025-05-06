import {TRPCReactProvider} from '@/trpc/client';
import {ClerkProvider} from '@clerk/nextjs';
import {PropsWithChildren} from 'react';

export const AppProvider = ({ children }: PropsWithChildren) => {
  return (
    <ClerkProvider signInUrl="/login" signUpUrl="/signup">
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </ClerkProvider>
  );
};
