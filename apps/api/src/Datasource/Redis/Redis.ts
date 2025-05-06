import {Injectable} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {Redis as IORedis} from "ioredis";
import {EnvVariables} from "src/Core/Environment/Schema";

@Injectable()
export class Redis extends IORedis {
  constructor(private readonly configService: ConfigService<EnvVariables>) {
    super({
      host: configService.get("REDIS_HOST"),
      port: configService.get("REDIS_PORT"),
      password: configService.get("REDIS_PASSWORD"),
      tls: process.env.ENV === "dev" ? undefined : {},
    });
  }
}
