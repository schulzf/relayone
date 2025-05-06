export class FailedHttpRequestException<Response extends any> extends Error {
  private _response: Response | undefined;

  constructor(message: string, response?: Response) {
    super(message);

    this._response = response;
  }

  get response(): Response | undefined {
    return this._response;
  }
}
