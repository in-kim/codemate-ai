import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/decorators/public.decorator';
import {
  ProgrammingLanguage,
  LanguageDisplayNames,
  LanguageIcons,
  LanguageExtensions,
} from 'src/shared/enums/language.enum';

interface LanguageInfo {
  id: string;
  name: string;
  icon: string;
  extension: string;
}

@ApiTags('언어')
@Public()
@Controller('/api/languages')
export class LanguageController {
  @Public()
  @Get()
  @ApiOperation({ summary: '지원하는 프로그래밍 언어 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '언어 목록 조회 성공',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'javascript' },
          name: { type: 'string', example: 'JavaScript' },
          icon: { type: 'string', example: '🟨' },
          extension: { type: 'string', example: 'js' },
        },
      },
    },
  })
  getLanguages(): LanguageInfo[] {
    return Object.values(ProgrammingLanguage).map((lang) => ({
      id: lang,
      name: LanguageDisplayNames[lang],
      icon: LanguageIcons[lang],
      extension: LanguageExtensions[lang],
    }));
  }
}
