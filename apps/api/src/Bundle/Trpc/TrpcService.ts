import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {endUserPermissions} from '@repo/permissions-enduser';
import SuperJSON from '@repo/superjson';
import {initTRPC, TRPCError} from '@trpc/server';
import {JwtPayload, verify} from 'jsonwebtoken';
import {LoggingService} from 'src/Core/Logging';
import {z} from 'zod';
import {Prisma} from '../../Datasource/Prisma/Prisma';
import {Redis} from '../../Datasource/Redis/Redis';
import {TrpcCtx} from './TrpcContext';

@Injectable()
export class TrpcService {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: Prisma,
    private readonly redis: Redis,
    private readonly log: LoggingService,
  ) {}

  trpc = initTRPC.context<TrpcCtx>().create({ transformer: SuperJSON });
  procedure = this.trpc.procedure;
  router = this.trpc.router;
  mergeRouters = this.trpc.mergeRouters;
  middleware = this.trpc.middleware;

  errorLoggingMiddleware = this.trpc.middleware(async (opts) => {
    const resp = await opts.next();

    if (!resp.ok) {
      this.log.error(resp.error);
    }

    return resp;
  });

  enrolledUserProcedure = this.trpc.procedure.use(this.errorLoggingMiddleware).use(
    this.trpc.middleware(async (opts) => {
      if (!opts.ctx.req.headers) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const token = opts.ctx.req.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      let tokenPayload: JwtPayload | undefined;

      try {
        tokenPayload = verify(token, this.config.get('CLERK_PEM')) as JwtPayload;
      } catch (error) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const organizationsIds = Object.keys(tokenPayload.organizations as Record<string, string>);

      if (!tokenPayload.organizations) {
        throw new TRPCError({
          code: `FORBIDDEN`,
          message: `You are not a member of any organizations`,
        });
      }

      // @todo this check on raw input must be delete once we have all migrated to contextual orgId and removed the orgId from the input in the frontend
      let input = z.object({ organizationId: z.string().optional() }).safeParse(opts.getRawInput());

      if (!input.data?.organizationId) {
        const inputToken = z.object({ orgId: z.string() }).safeParse(tokenPayload);

        if (inputToken.success) {
          input.data = {
            ...input.data,
            organizationId: inputToken.data.orgId,
          };
        }
      }

      if (input.success && input.data.organizationId) {
        if (!organizationsIds.some((id) => id === input.data.organizationId)) {
          throw new TRPCError({
            code: `FORBIDDEN`,
            message: `You are not a member of this organization`,
          });
        }

        opts.ctx.permissions = endUserPermissions.resolver(input.data.organizationId, (tokenPayload.publicMetadata as any) ?? {});
      }

      return opts.next({
        ctx: {
          user: { id: tokenPayload.sub, name: tokenPayload.userName, mfa: tokenPayload.mfa },
          orgId: tokenPayload.orgId,
          companyId: await this.findCompanyId(tokenPayload),
          organizations: organizationsIds,
        },
      });
    }),
  );

  orgEnrolledProcedure = this.trpc.procedure.use(this.errorLoggingMiddleware).use(
    this.trpc.middleware(async (opts) => {
      if (!opts.ctx.req.headers) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const token = opts.ctx.req.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      let tokenPayload: JwtPayload | undefined;

      try {
        tokenPayload = verify(token, this.config.get('CLERK_PEM')) as JwtPayload;
      } catch (error) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const organizationsIds = Object.keys(tokenPayload.organizations as Record<string, string>);

      if (!tokenPayload.organizations) {
        throw new TRPCError({
          code: `FORBIDDEN`,
          message: `You are not a member of any organizations`,
        });
      }

      // @todo this check on raw input must be delete once we have all migrated to contextual orgId and removed the orgId from the input in the frontend
      let input = z.object({ organizationId: z.string().optional() }).safeParse(opts.getRawInput());

      if (!input.data?.organizationId) {
        const inputToken = z.object({ orgId: z.string() }).safeParse(tokenPayload);

        if (inputToken.success) {
          input.data = {
            ...input.data,
            organizationId: inputToken.data.orgId,
          };
        }
      }

      if (input.success && input.data.organizationId) {
        if (!organizationsIds.some((id) => id === input.data.organizationId)) {
          throw new TRPCError({
            code: `FORBIDDEN`,
            message: `You are not a member of this organization`,
          });
        }

        opts.ctx.permissions = endUserPermissions.resolver(input.data.organizationId, (tokenPayload.publicMetadata as any) ?? {});
      }

      return opts.next({
        ctx: {
          user: { id: tokenPayload.sub, name: tokenPayload.userName, mfa: tokenPayload.mfa },
          orgId: tokenPayload.orgId,
          organizations: organizationsIds,
        },
      });
    }),
  );

  protectedProcedure = this.trpc.procedure.use(
    this.trpc.middleware(async (opts) => {
      if (!opts.ctx.req.headers) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const token = opts.ctx.req.headers['authorization']?.replace('Bearer ', '');

      if (!token) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      let tokenPayload: JwtPayload | undefined;

      try {
        tokenPayload = verify(token, this.config.get('CLERK_PEM')) as JwtPayload;
      } catch (error) {
        throw new TRPCError({
          code: `UNAUTHORIZED`,
          message: `You are not authorized to access this resource`,
        });
      }

      const organizationsIds = Object.keys(tokenPayload.organizations as Record<string, string>);

      return opts.next({
        ctx: {
          user: { id: tokenPayload.sub, name: tokenPayload.userName, mfa: tokenPayload.mfa },
          organizations: organizationsIds,
          companyId: await this.findCompanyId(tokenPayload),
        },
      });
    }),
  );

  private async findCompanyId(tokenPayload: JwtPayload) {
    let companyId = await this.redis.get(`org_id:${tokenPayload.orgId}`);

    if (companyId) {
      return companyId;
    }

    const company = await this.prisma.company.findFirst({
      where: { orgId: tokenPayload.orgId },
    });

    if (!company) {
      throw new TRPCError({ code: `NOT_FOUND`, message: `Company not found` });
    }

    return this.redis.set(`org_id:${tokenPayload.orgId}`, company.id);
  }
}
