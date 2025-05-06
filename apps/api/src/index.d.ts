export interface Builder<T, A extends any[]> {
  build(...args: A): T;
}

export interface Runner<T, A extends any[]> {
  run(...args: A): T;
}

export interface Service<T, A extends any[]> {
  do(...args: A): T;
}

export interface Resolver<T, A extends any[]> {
  resolve(...args: A): T;
}

export interface AsyncBuilder<T> {
  build(): Promise<T>;
}

export interface HandlerService<Return, Parameters extends any[]> {
  handle: (...params: Parameters) => Return;
}

export type UseCase<Return, Parameters extends any[]> = HandlerService<Return, Parameters>;

export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];
