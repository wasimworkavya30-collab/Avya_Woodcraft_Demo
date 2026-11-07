'use strict';

/** Error type understood by the API error handler. */
class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code || 'error';
  }

  static badRequest(message, code) {
    return new ApiError(400, message, code || 'bad_request');
  }

  static unauthorized(message) {
    return new ApiError(401, message || 'Sign in required.', 'unauthenticated');
  }

  static forbidden(message) {
    return new ApiError(403, message || 'You do not have access to this action.', 'forbidden');
  }

  static notFound(message) {
    return new ApiError(404, message || 'Not found.', 'not_found');
  }

  static unprocessable(message, details) {
    const err = new ApiError(422, message || 'The submitted data is not valid.', 'invalid_payload');
    err.details = details;
    return err;
  }
}

module.exports = { ApiError };
