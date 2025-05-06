export class UndefinedValueException extends Error {
  constructor(variable: string) {
    super(`${variable} is undefined`);
  }
}
