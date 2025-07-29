# 프론트엔드 개발 진행 상황

## 2025년 7월 28일

### 1. 인증/사용자 기능 구현 (로그인, 회원가입) 완료
- `api/auth.js`에 로그인, 회원가입, 로그아웃 API 연동 함수 구현.
- `src/components/auth/LoginForm.js`에 로그인 UI 및 로직 분리.
- `src/components/auth/RegisterForm.js`에 회원가입 UI 및 로직 분리.
- `src/pages/LoginPage.js`에 로그인/회원가입 폼 전환 로직 통합.
- `src/pages/HomePage.js`에 로그인 성공 후 메인 페이지 UI 구현.
- `src/App.js`에서 인증 상태에 따라 `LoginPage` 또는 `HomePage` 렌더링하도록 구조화.

### 2. 사용자 프로필 조회 및 수정 기능 구현 완료
- `api/user.js` 파일 생성 및 `getUserProfile`, `updateUserProfile` 함수 구현.
- `src/components/user` 디렉토리 생성.
- `src/components/user/UserProfileDisplay.js`에 프로필 정보 표시 컴포넌트 구현.
- `src/components/user/UserProfileEditForm.js`에 프로필 정보 수정 폼 컴포넌트 구현.
- `src/pages/UserProfilePage.js`에 사용자 프로필 페이지 구현 (조회/수정 전환).
- `react-router-dom` 설치 및 `App.js`에 라우팅 설정 (`/`, `/profile`).

### 3. 비밀번호 재설정 요청 및 확인 기능 구현 완료
- `api/auth.js`에 `passwordResetRequest` 및 `passwordResetConfirm` 함수 추가.
- `src/pages/PasswordResetRequestPage.js`에 비밀번호 재설정 요청 페이지 구현.
- `src/pages/PasswordResetConfirmPage.js`에 비밀번호 재설정 확인 페이지 구현.
- `App.js`에 비밀번호 재설정 관련 라우팅 추가 (`/password-reset-request`, `/password-reset-confirm`).

### 4. 다음 작업: 회사/셀럽 관련 기능 구현
- `api/company.js` 및 `api/celeb.js` 파일 생성 예정.
- `src/components/company` 및 `src/components/celeb` 디렉토리 생성 예정.
- `src/pages/CompanyListPage.js`, `src/pages/CompanyDetailPage.js`, `src/pages/CelebDetailPage.js` 등 페이지 생성 예정.
