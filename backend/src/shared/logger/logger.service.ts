import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  log(message: string, context?: string) {
    super.log(`📩 ${message}`, context);
  }

  warn(message: string, context?: string) {
    super.warn(`⚠️ ${message}`, context);
  }

  error(message: string, trace?: string, context?: string) {
    super.error(`❌ ${message}`, trace, context);
  }

  debug(message: string, context?: string) {
    super.debug(`🐛 ${message}`, context);
  }

  verbose(message: string, context?: string) {
    super.verbose(`🔍 ${message}`, context);
  }
}
