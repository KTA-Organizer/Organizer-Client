
export class ResponseError extends Error {
  statusCode;
  body;

  constructor(statusCode, body) {
    super("Unsuccesfull response");
    this.statusCode = statusCode;
    this.body = body;
  }
}