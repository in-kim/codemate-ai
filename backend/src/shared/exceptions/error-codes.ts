export enum ErrorCodes {
  EXECUTION_TIMEOUT = 'E1001',
  UNSUPPORTED_LANGUAGE = 'E1002',
  INTERNAL_ERROR = 'E9999',
}

export const ErrorMessages = {
  [ErrorCodes.EXECUTION_TIMEOUT]: 'Execution timeout',
  [ErrorCodes.UNSUPPORTED_LANGUAGE]: 'Unsupported language',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error',
};
