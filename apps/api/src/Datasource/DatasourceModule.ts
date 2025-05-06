import {Module} from "@nestjs/common";
import {ConfigModule} from "@nestjs/config";
import {Prisma} from "./Prisma/Prisma";
import {Redis} from "./Redis/Redis";

@Module({
  imports: [ConfigModule],
  providers: [Prisma, Redis],
  exports: [Prisma, Redis],
})
export class DatasourceModule {}
