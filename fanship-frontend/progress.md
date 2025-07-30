# 프론트엔드 개발 진행 상황



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

### 4. 비밀번호 변경 기능 수정 완료
- `api/auth.js`에 `changePassword` 함수 추가.
- `src/components/user/UserProfileEditForm.js`에서 비밀번호 관련 필드 제거.
- `src/components/user/ChangePasswordForm.js`에 비밀번호 변경 폼 컴포넌트 구현.
- `src/pages/ChangePasswordPage.js` 삭제.
- `src/pages/UserProfilePage.js`에 비밀번호 변경 폼 통합 및 토글 기능 추가.
- `App.js`에서 비밀번호 변경 라우팅 제거 및 내비게이션 링크 제거.

### 5. 비밀번호 확인 필드 및 실시간 유효성 검사 추가 완료
- `src/components/user/ChangePasswordForm.js`에 `confirmNewPassword` 필드 추가 및 실시간 일치 유효성 검사 구현.
- `src/components/auth/RegisterForm.js`에 `confirmPassword` 필드 추가 및 실시간 일치 유효성 검사 구현.

### 6. 비밀번호 길이 유효성 검사 추가 완료
- `src/components/user/ChangePasswordForm.js`에 새 비밀번호 최소 8자 길이 유효성 검사 추가.
- `src/components/auth/RegisterForm.js`에 비밀번호 최소 8자 길이 유효성 검사 추가.

### 7. 회사/셀럽 관련 기능 구현 시작
- `api/company.js` 파일 생성 및 `createCompany`, `getCompanyList`, `getCelebsByCompanyId` 함수 구현.
- `api/celeb.js` 파일 생성 및 `getCelebDetail` 함수 구현.
- `src/components/company` 및 `src/components/celeb` 디렉토리 생성.
- `src/components/company/CompanyList.js`에 회사 목록 표시 컴포넌트 구현.
- `src/pages/CompanyListPage.js`에 회사 목록 페이지 구현.
- `App.js`에 회사 목록 라우팅 추가 (`/companies`).

### 8. 회사 상세 및 셀럽 상세 페이지 구현 완료
- `src/pages/CompanyDetailPage.js`에 회사 상세 페이지 구현 (회사 소속 셀럽 목록 포함).
- `src/pages/CelebDetailPage.js`에 셀럽 상세 페이지 구현.
- `App.js`에 회사 상세 (`/companies/:companyId`) 및 셀럽 상세 (`/celebs/:celebId`) 라우팅 추가.
- `src/components/company/CompanyList.js`에서 회사 상세 페이지로 이동하는 링크 추가.
- `src/pages/CompanyDetailPage.js`에서 셀럽 상세 페이지로 이동하는 링크 추가.

### 9. 회사 목록 조회 기능 개선 완료
- `src/components/company/CompanyList.js`에서 지역 필터를 탭 UI로 변경 (서울, 부산, 대구).
- `src/components/company/CompanyList.js`에 회사 이름 검색 기능 추가 (검색 버튼 또는 엔터).

### 10. 즐겨찾기 관련 기능 구현 시작
- `api/favorite.js` 파일 생성 및 `addFavorite`, `removeFavorite`, `getFavorites` 함수 구현.
- `src/components/favorite` 디렉토리 생성.
- `src/components/favorite/FavoriteList.js`에 즐겨찾기 목록 표시 컴포넌트 구현.
- `src/pages/FavoriteListPage.js`에 즐겨찾기 목록 페이지 구현.
- `App.js`에 즐겨찾기 라우팅 추가 (`/favorites`).

### 11. 즐겨찾기 추가 기능 구현 완료
- `CompanyDetailPage.js` 및 `CelebDetailPage.js`에 즐겨찾기 추가 버튼 구현.

### 12. 즐겨찾기 목록 페이지 개선 완료
- `src/components/favorite/FavoriteList.js`에서 즐겨찾기 항목 클릭 시 해당 상세 페이지로 이동하는 링크 추가.

### 13. 즐겨찾기 개선 완료 (상세 페이지에서 즐겨찾기 삭제 기능 추가)
- `App.js`에서 `CompanyDetailPage`와 `CelebDetailPage`에 `userId` prop 전달.
- `CompanyDetailPage.js`에 즐겨찾기 상태 확인 및 추가/삭제 버튼 조건부 렌더링 로직 추가.
- `CelebDetailPage.js`에 즐겨찾기 상태 확인 및 추가/삭제 버튼 조건부 렌더링 로직 추가.

### 14. 다음 작업: 게시판 관련 기능 구현
- `api/post.js` 파일 생성 예정.
- `src/components/post` 디렉토리 생성 예정.
- `src/pages/PostListPage.js`, `src/pages/PostDetailPage.js`, `src/pages/PostCreatePage.js` 등 페이지 생성 예정.
