import {BadRequestException} from "@nestjs/common";
import {z, ZodEffects, ZodObject} from "zod";
import {safeAwait} from "./SafeAwait";

export const validateOrThrow = async <
  T extends ZodObject<any> | ZodEffects<any>,
>(
  schema: T,
  data: unknown
): Promise<z.infer<T>> => {
  const validation = await safeAwait(schema.parseAsync(data));

  if (validation.error) {
    throw new BadRequestException((validation.error as any).issues);
  }

  return validation.result;
};
