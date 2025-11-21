export class AppError extends Error {
  constructor(
    public readonly code: number,
    public readonly name: string,
    public readonly message: string,
    public readonly details?: unknown
  ) {
    super(message);
  }

  static badRequest(message: string) {
    return new AppError(400, 'BadRequest', message);
  }

  static unauthorized(message: string) {
    return new AppError(401, 'Unauthorized', message);
  }

  static forbidden(message: string) {
    return new AppError(403, 'Forbidden', message);
  }

  static notFound(message: string) {
    return new AppError(404, 'NotFound', message);
  }

  static notAllowed(message: string) {
    return new AppError(405, 'NotAllowed', message);
  }

  static internal(message?: string, details?: unknown) {
    return new AppError(
      500,
      'InternalServerError',
      message ?? 'Internal server error',
      details
    );
  }
}
