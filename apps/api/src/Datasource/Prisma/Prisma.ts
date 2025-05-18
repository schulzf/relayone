import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@repo/db';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {
    super({ datasourceUrl: configService.get<any>('DATABASE_URL') });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
