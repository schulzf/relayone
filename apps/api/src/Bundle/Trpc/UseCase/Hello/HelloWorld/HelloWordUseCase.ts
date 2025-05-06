import {Injectable} from '@nestjs/common';
import {UseCase} from 'src';
import {TrpcService} from '../../../TrpcService';

@Injectable()
export class HelloWorldUseCase implements UseCase<void, []> {
  constructor(private readonly trpc: TrpcService) {}

  handle = () =>
    this.trpc.procedure.query(async ({ ctx, input }) => {
      return 'Hello World - All good with API';
    });
}
