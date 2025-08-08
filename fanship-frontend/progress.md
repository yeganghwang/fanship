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

### 14. 게시판 관련 기능 구현 완료
- `api/post.js` 파일 생성 및 게시판 CRUD API 함수 구현.
- `src/components/post` 디렉토리 생성.
- `src/components/post/PostList.js`에 게시글 목록 표시 컴포넌트 구현.
- `src/components/post/PostForm.js`에 게시글 작성/수정 폼 컴포넌트 구현.
- `src/pages/PostListPage.js`에 게시글 목록 페이지 구현 및 글쓰기 버튼 추가.
- `src/pages/PostDetailPage.js`에 게시글 상세 페이지 구현 및 권한에 따른 수정/삭제 버튼 표시.
- `src/pages/PostCreatePage.js`에 게시글 작성 페이지 구현.
- `src/pages/PostEditPage.js`에 게시글 수정 페이지 구현.
- `App.js`에 게시판 관련 라우팅 추가 (`/posts`, `/posts/create`, `/posts/:postId`, `/posts/:postId/edit`).

### 15. 게시판 목록 조회 로직 수정 완료
- `src/components/post/PostList.js`에서 `notice` 파라미터를 `true`일 때만 API 요청에 포함하도록 수정.

### 16. 게시글 작성 오류 수정 완료
- `src/components/post/PostForm.js`의 `useEffect` 로직을 수정하여 `initialData`가 있을 때만 실행되도록 변경.

### 17. 게시판 목록 UI 개선 완료
- `src/components/post/PostList.js`에서 "공지사항만 보기" 체크박스를 "전체"와 "공지" 탭으로 변경.

### 18. 게시글 작성일 표시 형식 변경 완료
- `date-fns` 및 `date-fns-tz` 라이브러리 설치.
- `src/utils/date.js`에 UTC를 KST로 변환하는 `formatToKST` 유틸리티 함수 생성.
- `src/components/post/PostList.js`와 `src/pages/PostDetailPage.js`에서 `formatToKST` 함수를 사용하여 날짜 형식을 `YYYY-MM-DD HH:MM:SS`로 변경.

### 19. 게시글 조회 보안 및 UI 개선 완료
- `src/pages/PostDetailPage.js`에서 `dangerouslySetInnerHTML`을 제거하고, CSS의 `white-space: 'pre-wrap'` 속성을 사용하여 XSS 공격을 방지하고 줄바꿈을 올바르게 표시하도록 수정.

### 20. 게시판 기능 고도화 및 댓글 기능 구현 완료
- `api/post.js`에 `getPostsByUserId` 함수 추가.
- `CelebDetailPage.js`에서 `getPostsByUserId`를 사용하여 해당 셀럽의 게시글 목록 표시.
- `CompanyDetailPage.js`에서 `getPostsByUserId`를 사용하여 해당 회사 CEO의 게시글 목록 표시.
- `PostList.js`에서 작성자 이름을 클릭하면 해당 작성자의 프로필 페이지로 이동하는 링크 추가.
- `api/comment.js` 파일 생성 및 댓글 CRUD API 함수 구현.
- `src/components/comment` 디렉토리 생성.
- `src/components/comment/CommentList.js`에 댓글 목록 표시 및 권한에 따른 삭제 버튼 구현.
- `src/components/comment/CommentForm.js`에 댓글 작성 폼 구현.
- `PostDetailPage.js`에 댓글 목록 및 작성 폼 추가.

### 21. 회사 상세 페이지 오류 수정 완료
- `CompanyDetailPage.js`에서 `getCelebsByCompanyId` 응답에서 `ceo_id`와 `company_name`을 직접 사용하도록 로직 수정.

### 22. 게시판 작성자 프로필 링크 오류 수정 완료
- `src/pages/PublicProfilePage.js` 생성 및 `App.js`에 라우팅 추가 (`/users/:userId`).

### 23. 굿즈 관련 기능 구현 완료
- `api/goods.js` 파일 생성 및 굿즈 CRUD API 함수 구현.
- `src/components/goods` 디렉토리 생성.
- `src/components/goods/GoodsList.js`에 굿즈 목록 표시 컴포넌트 구현.
- `src/components/goods/GoodsForm.js`에 굿즈 작성/수정 폼 컴포넌트 구현.
- `src/pages/GoodsListPage.js`에 굿즈 목록 페이지 구현 및 굿즈 등록 버튼 추가.
- `src/pages/GoodsDetailPage.js`에 굿즈 상세 페이지 구현 및 권한에 따른 수정/삭제 버튼 표시.
- `src/pages/GoodsCreatePage.js`에 굿즈 작성 페이지 구현.
- `src/pages/GoodsEditPage.js`에 굿즈 수정 페이지 구현.
- `App.js`에 굿즈 관련 라우팅 추가 (`/goods`, `/goods/create`, `/goods/:goodsId`, `/goods/:goodsId/edit`).

### 24. 셀럽 상세 페이지 굿즈 목록 표시 기능 추가 완료
- `CelebDetailPage.js`에 해당 셀럽이 등록한 굿즈 목록을 표시하는 기능 추가.

### 25. 스케줄 관련 기능 구현 완료
- `api/schedule.js` 파일 생성 및 스케줄 CRUD API 함수 구현.
- `src/components/schedule` 디렉토리 생성.
- `src/components/schedule/ScheduleList.js`에 스케줄 목록 표시 및 권한에 따른 삭제 버튼 구현.
- `src/components/schedule/ScheduleForm.js`에 스케줄 등록 폼 구현.
- `CelebDetailPage.js`에 스케줄 목록 및 등록 폼 추가, 권한에 따른 관리 버튼 표시.

### 26. 스케줄 등록 UI 개선 완료
- `src/components/schedule/ScheduleForm.js`에서 시간 입력을 드롭다운으로 변경하여 사용자 경험 개선.

### 27. 메인 홈페이지 개편 완료
- `HomePage.js`에서 디버깅용 사용자 정보 제거.
- 셀럽 로그인 시 "마이 페이지"로 이동하는 카드 추가.
- 최신 게시글, 주요 회사, 인기 굿즈 목록을 Bootstrap 카드로 표시.

### 28. 회원가입 폼 개선 완료
- `src/components/auth/RegisterForm.js`에서 셀럽 선택 시 회사 및 셀럽 유형 선택 드롭다운 추가.

### 29. 게시글 이미지 첨부 기능 오류 수정 완료
- `src/components/post/PostForm.js`의 이미지 업로드 로직을 `api/upload.js`의 `uploadImage` 함수에 맞게 수정.

### 30. 게시글 이미지 렌더링 오류 수정 완료
- `dompurify` 라이브러리 설치.
- `PostDetailPage.js`에서 `DOMPurify`를 사용하여 HTML을 정화하고 `dangerouslySetInnerHTML`을 통해 안전하게 렌더링하도록 수정.

### 31. 게시글 및 굿즈 내용 줄바꿈 오류 수정 완료
- `PostDetailPage.js`와 `GoodsDetailPage.js`에서 렌더링 전에 `\n`을 `<br />`로 치환하여 줄바꿈이 올바르게 표시되도록 수정.

### 32. 메인 홈페이지 즐겨찾기 목록 표시 오류 수정 완료
- `HomePage.js`의 데이터 로딩 로직을 공용 데이터와 사용자 데이터로 분리하여 로그인 시 즐겨찾기 목록이 즉시 표시되도록 수정.

### 33. 셀럽 상세 페이지 프로필 수정 버튼 추가 완료
- `CelebDetailPage.js`에 프로필 수정 버튼 추가 및 권한에 따른 표시 로직 구현.

### 34. 로그인 기록 기능 구현 완료
- `api/log.js` 파일 생성 및 `recordLogin` 함수 구현.
- `LoginPage.js`에서 로그인 성공 시 `recordLogin` API 호출 로직 추가.

### 35. 다음 작업: 전체적인 UI/UX 개선
- 모든 페이지에 일관된 디자인 시스템 적용 (Bootstrap 활용).
- 반응형 웹 디자인 구현.
- 로딩, 에러, 빈 데이터 상태 등 다양한 UI 상태에 대한 시각적 피드백 개선.
