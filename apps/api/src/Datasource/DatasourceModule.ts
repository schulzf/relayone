import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './Prisma/Prisma';
import { Redis } from './Redis/Redis';

@Module({
  imports: [ConfigModule],
  providers: [PrismaService, Redis],
  exports: [PrismaService, Redis],
})
export class DatasourceModule {}
