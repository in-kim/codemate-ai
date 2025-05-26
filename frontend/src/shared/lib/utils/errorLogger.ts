export function logError(error: unknown) {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    console.error('[DEV ERROR]', error);
  }

  // ✅ 추후 외부 로그 수집 서비스 연동
  // Example: Sentry.captureException(error);
  // Example: customLogger.send(error);
}