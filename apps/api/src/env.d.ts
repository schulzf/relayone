import {EnvVariables} from './Core/Environment/Schema';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvVariables {}
  }
}

export { };

