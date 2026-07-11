# Clover Desk — AI 시대에서 살아남기

내 일에 맞는 네잎클로버를 찾는 여정. Next.js + Supabase 기반 MVP.

## 스프린트 1 범위 (현재 구현됨)

- Next.js 15 (App Router) + TypeScript + Tailwind v4 프로젝트 셋업
- Pretendard 폰트 + Clover Desk 컬러 토큰 (`src/app/globals.css`)
- Supabase Auth 연동 (`src/lib/supabase/*`), 세션 유지 미들웨어
- 카카오 로그인 (`/login` → `/auth/callback`)
- `handle_new_user()` DB 트리거로 `profiles` 자동 생성 + 클로버 번호 자동 발급 + 가입 성장도 +100
- 좌측 사이드바 AppShell / 모바일 하단 내비게이션
- 랜딩 페이지(`/`), 로그인 페이지(`/login`), 홈 대시보드(`/home`), 나의 클로버 카드(`/my-clover-card`)
- 클로버 찾기 · 클로버 지도 · 우체통 · 관리자 페이지는 다음 스프린트를 위한 라우팅 스텁으로 준비됨

## 1. Supabase 프로젝트 설정

1. [supabase.com](https://supabase.com) 에서 새 프로젝트 생성
2. **SQL Editor**에서 아래 순서로 실행
   1. `supabase/schema.sql` — 테이블 + 트리거 (profiles 자동 생성 포함)
   2. `supabase/rls.sql` — Row Level Security 정책
   3. `supabase/schema_sprint2.sql` — 성장도 지급 RPC
   4. `supabase/schema_sprint4.sql` — 관리자 저장 수 집계 정책
   5. `supabase/schema_sprint5.sql` — 이메일/비번 가입 + 전화번호 중복확인
   6. `supabase/create_admin.sql` — 관리자 계정 생성 (adminmin@clover.local)
   7. `supabase/seed.sql` — 샘플 레시피 (선택)
   3. `supabase/seed.sql` — 샘플 레시피 (선택)
3. **Authentication → Providers → Kakao** 활성화
   - Kakao Developers에서 앱 생성 → REST API 키, Client Secret 발급
   - Redirect URI를 Supabase가 안내하는 콜백 URL로 등록
     (`https://<project-ref>.supabase.co/auth/v1/callback`)
4. **Authentication → URL Configuration**에서 Site URL / Redirect URLs에
   `http://localhost:3000/auth/callback` (개발용), 배포 도메인의 `/auth/callback` 추가

## 2. 환경변수

```bash
cp .env.local.example .env.local
```

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`를 Supabase 프로젝트 설정(API)에서 복사해 채워주세요.

## 3. 로컬 실행

```bash
npm install
npm run dev
```

`http://localhost:3000` 접속.

## 4. 관리자 계정

`supabase/create_admin.sql`을 실행하면 아래 계정이 바로 관리자 권한으로 생성돼요.

- 로그인 방법: 홈페이지(`/`) **우측 하단의 자물쇠 아이콘** 클릭 → 아이디/비밀번호 입력
- 아이디: `adminmin` (이메일 형식 아님 — 내부적으로 `adminmin@clover.local`로 자동 변환돼요)
- 비밀번호: `Dldmsql9898*`
- 로그인 성공 시 자동으로 `/admin`으로 이동해요

카카오로 가입한 계정을 관리자로 바꾸고 싶다면:

```sql
update profiles set role = 'admin' where email = '본인 이메일';
```

## 5. 배포 (Vercel 기준)

1. GitHub 저장소로 push
2. Vercel에서 Import → 환경변수(`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) 등록
3. Supabase Redirect URLs에 배포 도메인 `/auth/callback` 추가
4. 배포 후 카카오 로그인 → `/home` 진입까지 확인

## 다음 스프린트

- **스프린트 2**: 클로버 찾기 4단계 진단 + 룰 기반 추천 결과 페이지
- **스프린트 3**: 클로버 지도(필터/정렬) + 레시피 상세(6단계) + 저장/하트
- **스프린트 4**: 클로버 우체통 + 관리자 페이지(레시피 CRUD, 우체통 관리, 대시보드)
