import {ClerkClient, createClerkClient} from '@clerk/backend';
import {Injectable} from '@nestjs/common';
import {Permissions} from '@repo/permissions-enduser';
import {CreateExpressContextOptions} from '@trpc/server/adapters/express';

@Injectable()
export class TrpcContext {
  async createCtx({ req }: CreateExpressContextOptions): Promise<TrpcCtx> {
    const clerk = createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    return {
      req,
      user: { id: '', name: '', mfa: false },
      permissions: null,
      organizations: [],
      clerk,
    };
  }
}

export type TrpcCtx = {
  req: CreateExpressContextOptions['req'];
  user: { id: string; name: string; mfa: boolean };
  permissions: Permissions | null;
  organizations: string[];
  clerk: ClerkClient;
};
