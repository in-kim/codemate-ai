This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## structure
```bash
src/
├── app/                    # Next.js App Router 경로
│   ├── page.tsx             # 메인 진입
│   ├── layout.tsx
│   └── api/                 # next-auth 등 API 핸들러
├── entities/                # 가장 핵심 Domain
│   ├── code/                # 코드 작성 관련 Entity
│   ├── review/              # 리뷰 결과 Entity
│   ├── user/                # 사용자 Entity
├── features/                # 기능 단위 (협업, 리뷰 요청, 실행 등)
│   ├── collaboration/       # 실시간 협업 기능
│   ├── reviewRequest/       # 코드 리뷰 요청 기능
│   ├── codeExecution/       # 코드 실행 기능
│   ├── auth/                # GitHub OAuth 로그인 기능
├── shared/                  # 공통 모듈
│   ├── ui/                  # 버튼, 카드 등 공통 UI 컴포넌트
│   ├── lib/                 # 유틸 함수, 통신 모듈
│   ├── hooks/               # 공통 커스텀 훅
│   ├── config/              # 환경변수 관리
│   └── styles/              # Tailwind Custom 설정
```