import { Injectable } from '@nestjs/common';
import { Type } from '@nestjs/common/interfaces/type.interface';
import { ModuleRef } from '@nestjs/core';
import { UseCase } from '../index';

@Injectable()
export default abstract class UseCaseContainer<U extends UseCase<any, any>> {
  constructor(protected readonly container: ModuleRef) {}

  async create<T extends U>(type: Type<T>): Promise<T> {
    return this.container.create(type);
  }
}
