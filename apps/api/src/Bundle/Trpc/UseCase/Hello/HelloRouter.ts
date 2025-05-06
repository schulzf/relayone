import {Injectable} from '@nestjs/common';
import {TrpcService} from '../../TrpcService';
import {HelloWorldUseCase} from './HelloWorld/HelloWordUseCase';
import {HelloWorldEnrolledUserUseCase} from './HelloWorldEnrolledUser/HelloWordEnrolledUserUseCase';

@Injectable()
export class HelloRouter {
  constructor(
    private readonly trpc: TrpcService,
    private readonly helloWorld: HelloWorldUseCase,
    private readonly helloWorldEnrolledUser: HelloWorldEnrolledUserUseCase,
  ) {}

  router = this.trpc.router({
    helloWorld: this.helloWorld.handle(),
    helloWorldEnrolledUser: this.helloWorldEnrolledUser.handle(),
  });
}
