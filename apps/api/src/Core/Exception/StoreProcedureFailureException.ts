export class StoreProcedureFailureException extends Error {
  constructor(name: string, error: Error) {
    super(`${name} : ${error.message}`);
  }
}
