import {Injectable} from '@nestjs/common';
import {UseCase} from 'src';
import {TrpcService} from '../../../TrpcService';

@Injectable()
export class HelloWorldEnrolledUserUseCase implements UseCase<void, []> {
  constructor(private readonly trpc: TrpcService) {}

  handle = () =>
    this.trpc.enrolledUserProcedure.query(async ({ ctx }) => {
      return `Hello ${ctx.user.name} - All good with API`;
    });
}
