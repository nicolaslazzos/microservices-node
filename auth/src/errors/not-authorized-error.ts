import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode = 400;
  message = "Not authorized";

  constructor() {
    super("Not authorized");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
