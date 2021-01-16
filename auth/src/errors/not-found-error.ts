import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  statusCode = 404;
  message = "Page not found";

  constructor() {
    super("Page not found");

    // only because we are extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
