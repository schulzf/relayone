export class SuspendedResourceAccessException extends Error {
  constructor() {
    super(`Your access to this resource has been suspended.`);
  }
}
