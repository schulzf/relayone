import {TRPCError} from '@trpc/server';

export class TRPCNotFoundError extends TRPCError {
  constructor(entity: string) {
    super({ code: 'NOT_FOUND', message: `${entity} not found` });
  }
}
