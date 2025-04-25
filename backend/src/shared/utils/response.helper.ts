export class ResponseHelper {
  static success<T = any>(data: T) {
    return {
      status: 'success',
      data: data,
    };
  }

  static fail(message = 'Internal Server Error', code = 500) {
    return {
      status: 'fail',
      message,
      code,
    };
  }
}
