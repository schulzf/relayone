import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {environment} from 'src/Core/Environment';
import {LoggingService} from 'src/Core/Logging';
import {DatasourceModule} from 'src/Datasource/DatasourceModule';
import {TrpcContext} from './TrpcContext';
import {TrpcRouter} from './TrpcRouter';
import {TrpcService} from './TrpcService';
import Hello from './UseCase/Hello';

@Module({
  imports: [ConfigModule.forRoot({ validate: environment.validate }), DatasourceModule],
  providers: [TrpcRouter, TrpcService, TrpcContext, LoggingService, ...Hello],
  exports: [],
})
export class TrpcModule {}
