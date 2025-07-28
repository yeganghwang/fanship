# REST API 명세서

- snake_case

## 0. 어댑트 정보

### 0.1. 인증 관련
- **JWT 토큰 만료 시간**: 환경변수 `JWT_EXPIRES_IN`에 설정된 값 (기본값: 1시간)
- **토큰 갱신 방법**: 
  - 현재는 Refresh Token을 지원하지 않습니다.
  - 토큰이 만료되면 사용자는 다시 로그인해야 합니다.
  - 향후 Refresh Token 구현 예정입니다.
- **로그아웃 API 엔드포인트**: 
  - 현재는 서버 사이드 로그아웃을 지원하지 않습니다.
  - 클라이언트에서 토큰을 삭제하는 방식으로 로그아웃을 처리합니다.
  - 향후 토큰 블랙리스트 기능 구현 예정입니다.

### 0.2. 데이터 검증 규칙
- **사용자명 (username)**: 
  - 최소 4자, 최대 20자
  - 영문, 숫자, 언더스코어(_)만 허용
  - 중복 불가
- **비밀번호 (password)**:
  - 최소 8자
  - 영문, 숫자, 특수문자 조합 권장
- **이메일 (mail)**:
  - 표준 이메일 형식 검증
  - 중복 불가
- **닉네임 (nickname)**:
  - 최대 12자
  - 중복 불가
- **인스타그램 URL (ig_url)**:
  - 선택사항
  - 표준 URL 형식 검증
  - 중복 불가
- **프로필 이미지 URL (pfp_img_url)**:
  - 선택사항
  - 표준 URL 형식 검증
- **사용자 유형 (position)** 허용값:
  - `manager` (관리자)
  - `fan` (일반 사용자)
  - `celeb` (셀럽)
  - `ceo` (회사 대표)
- **셀럽 유형 (celeb_type)**: 
  - `position`이 `celeb`인 경우에만 필수
  - 모든 문자열 내용 허용
- **회사 ID (company_id)**:
  - `position`이 `celeb`인 경우에만 필수
  - 정수형
- **생년월일 (dob)**:
  - 선택사항
  - ISO 8601 날짜 형식 (YYYY-MM-DD)

### 0.3. 페이지네이션
- **모든 목록 조회 API에서 페이지네이션을 지원합니다** (백엔드 구현 완료).
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (1부터 시작, 기본값: 1, 선택사항)
  - `limit`: 페이지당 항목 수 (기본값: 20, 최대값: 100, 선택사항)
- **응답 형식**:
  ```json
  {
    "list": [...],
    "pagination": {
      "current_page": 1,
      "total_pages": 5,
      "total_items": 100,
      "limit": 20,
      "has_next": true,
      "has_prev": false
    }
  }
  ```
- **적용된 엔드포인트** (총 9개):
  - `2.2` 회사 목록 조회
  - `2.3` 회사 소속된 셀럽 목록 조회 
  - `3.3` 사용자의 즐겨찾기 목록 조회
  - `3.4` 사용자가 작성한 게시글 목록 조회
  - `4.2` 게시글 목록 조회
  - `4.7` 댓글 목록 조회
  - `5.2` 셀럽 스케줄 조회
  - `6.2` 굿즈 목록 조회
  - `6.6` 특정 사용자가 등록한 굿즈 목록 조회

### 0.4. 파일 업로드
- 현재 프로필 이미지 업로드 방법이 제한되어 있지 않습니다.
- **지원 파일 형식**: jpg, png, gif, webp, jpeg
- **최대 파일 크기**: 15MB
- **권장 이미지 크기**: 300x300px 이상
- 향후 파일 업로드 API 엔드포인트 구현 예정입니다.

### 0.5. API 버전 관리
- 현재 API 버전: v1
- 하위 호환성을 보장합니다.
- 주요 변경사항이 있을 경우 새로운 버전을 릴리즈합니다.

### 0.6. 에러 처리
- 모든 API는 표준 HTTP 상태 코드를 사용합니다.
- 에러 응답은 일관된 JSON 형식을 따릅니다.
- 상세한 에러 메시지를 제공합니다.

## 1. 인증 / 사용자

### 1.1. 회원가입
- **POST** `/api/auth/register`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `username` | string | YES | 로그인 ID | |
| `password` | string | YES | 비밀번호 | |
| `mail` | string | YES | 이메일 주소 | |
| `nickname` | string | YES | 사용자 닉네임 | |
| `position` | string | YES | 사용자 유형 | |
| `dob` | string(date) | null | 생년월일 (YYYY-MM-DD) | |
| `ig_url` | string | null | 인스타그램 URL | |
| `pfp_img_url` | string | null | 프로필 이미지 URL | |
| `company_id` | int | null | 소속 회사 ID | |
| `celeb_type` | string | null | 셀럽 유형 | |

```json
{
  "username": "test_user_register",
  "password": "test_password",
  "mail": "test_register@example.com",
  "nickname": "테스트유저",
  "position": "fan",
  "dob": "2000-01-01",
  "ig_url": "https://instagram.com/test_register",
  "pfp_img_url": "https://example.com/test_register.jpg",
  "company_id": null,
  "celeb_type": null
}
```

- Response: 201 Created + 응답

```json
{
  "user_id": 30,
  "username": "test_user_register",
  "password": "$2b$10$u7E5WVeIa51BkOk/9Ovb0u6ZPdSrcAp3aPuDdtHiwvlEi0pjbLO.G",
  "mail": "test_register@example.com",
  "nickname": "테스트유저",
  "dob": "2000-01-01",
  "pfp_img_url": "https://example.com/test_register.jpg",
  "join_dt": "2025-07-27T05:00:40.000Z",
  "ig_url": "https://instagram.com/test_register",
  "position": "fan"
}
```

---

### 1.2. 로그인

- 로그인 기능입니다. 응답으로써 `user_id`는 필수적으로 제공되며, 셀럽의 경우 `celeb_id`를 제공하고, ceo의 경우 `ceo_id`를 제공합니다. 셀럽이나 ceo는 본인이 속한 회사의 `company_id`를 제공받습니다.
- **POST** `/api/auth/login`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `username` | string | YES | 로그인 ID | |
| `password` | string | YES | 비밀번호 | |

```json
{
  "username": "fan001",
  "password": "qwer1234"
}
```
- Response: 200 OK + JWT 토큰
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  "user_id": 1,
  "celeb_id": null,
  "ceo_id": null,
  "company_id": null
}
```

---

### 1.3. 로그아웃
- **POST** `/api/auth/logout`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 200 OK + 로그아웃 성공 메시지
```json
{
  "message": "Successfully logged out"
}
```

---

### 1.4. 사용자 프로필 조회
- **GET** `/api/users/{user_id}`
- 인증 불필요
- Response
```json
{
  "nickname": "팬001",
  "position": "fan",
  "pfp_img_url": null,
  "ig_url": null
}
```

---

### 1.5. 사용자 정보 수정
- **PATCH** `/api/users/{user_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `nickname` | string | null | 사용자 닉네임 | |
| `password` | string | null | 비밀번호 | 비밀번호 변경 시 |
| `pfp_img_url` | string | null | 프로필 이미지 URL | |
| `ig_url` | string | null | 인스타그램 URL | |

```json
{
  "nickname": "새로운닉네임",
  "pfp_img_url": "https://example.com/new_pfp.jpg"
}
```
- Response: 200 OK + 업데이트된 사용자 정보

```json
{
  "user_id": 30,
  "username": "test_user_register",
  "password": "$2b$10$u7E5WVeIa51BkOk/9Ovb0u6ZPdSrcAp3aPuDdtHiwvlEi0pjbLO.G",
  "mail": "test_register@example.com",
  "nickname": "새로운닉네임",
  "dob": "2000-01-01",
  "pfp_img_url": "https://example.com/new_pfp.jpg",
  "join_dt": "2025-07-27T05:00:40.000Z",
  "ig_url": "https://instagram.com/test_register",
  "position": "fan"
}
```

---

### 1.6. 사용자 삭제 (구현 안 할 예정)
- **DELETE** `/api/users/{user_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

### 1.7. 비밀번호 재설정 요청
- **POST** `/api/auth/password-reset-request`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `mail` | string | YES | 이메일 주소 | |

```json
{
  "mail": "user@example.com"
}
```
- Response: 200 OK + 요청 성공 메시지
```json
{
  "message": "Password reset email sent"
}
```

---

### 1.8. 비밀번호 재설정 확인
- **POST** `/api/auth/password-reset-confirm`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `token` | string | YES | 재설정 토큰 | |
| `new_password` | string | YES | 새 비밀번호 | 최소 8자 |

```json
{
  "token": "reset_token_here",
  "new_password": "new_password123"
}
```
- Response: 200 OK + 재설정 성공 메시지
```json
{
  "message": "Password successfully reset"
}
```

---

## 2. 회사 / 셀럽

### 2.1. 회사 등록
- **POST** `/api/companies`
- Header: Authorization (CEO 권한 필요)
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `company_name` | string | YES | 회사명 | |
| `company_type` | string | YES | 회사 형태 | |
| `region` | string | YES | 지역명 | Optional(생략 시 모든 회사 정보 반환) |

```json
{
  "company_name": "새로운기획사",
  "company_type": "엔터테인먼트",
  "region": "부산"
}
```
- Response: 201 Created + 생성된 회사 정보
```json
{
  "company_id": 8,
  "company_name": "새로운기획사",
  "ceo_id": 30,
  "company_type": "엔터테인먼트",
  "region": "부산"
}
```
---

### 2.2. 회사 목록 조회
- **GET** `/api/companies`
- Query: 
  - `region` (String, Optional): 지역별 필터링 (생략 시 모든 회사 정보 반환)
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- Response: 200 OK + 회사 리스트
```json
{
  "list": [
    {
      "company_id": 1,
      "company_name": "스타기획사",
      "ceo_id": 3,
      "company_type": "기획사",
      "region": "서울"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 30,
    "limit": 20,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 2.3. 회사 소속된 셀럽 목록 조회
- **GET** `/api/companies/{company_id}/celebs`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- 인증 불필요
- Response: 200 OK + 셀럽 정보 배열
```json
{
  "list": [
    {
      "celeb_id": 1,
      "nickname": "스타001",
      "celeb_type": "가수"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 5,
    "limit": 20,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### 2.4. 셀럽 상세 조회
- **GET** `/api/celebs/{celeb_id}`
- 인증 불필요
- Response: 200 OK + 셀럽 정보
```json
{
  "nickname": "스타001",
  "celeb_type": "가수",
  "company_name": "스타기획사",
  "ig_url": "https://instagram.com/star001",
  "pfp_img_url": "http://example.com/pfp1.jpg",
  "dob": "1995-05-20"
}
```

---

## 3. 즐겨찾기

### 3.1. 즐겨찾기 추가
- **POST** `/api/favorites`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `company_id` | int | null | 회사id | |
| `celeb_id` | int | null | 셀럽id | |

- `company_id`, `celeb_id` 둘 중 하나만 포함되어 있어야 함.

```json
{
  "company_id": 1
}
```
- Response: 201 Created + 생성된 즐겨찾기 정보
```json
{
  "favorite_id": 1
}
```

---

### 3.2. 즐겨찾기 삭제
- **DELETE** `/api/favorites/{favorite_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

### 3.3. 사용자의 즐겨찾기 목록 조회
- **GET** `/api/users/{user_id}/favorites`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- Response: 200 OK + 즐겨찾기 목록

```json
{
  "list": [
    {
      "favorite_id": 1,
      "user_id": 1,
      "company_id": 1,
      "celeb_id": null,
      "company_name": "스타기획사",
      "celeb_nickname": null
    },
    {
      "favorite_id": 2,
      "user_id": 1,
      "company_id": null,
      "celeb_id": 1,
      "company_name": null,
      "celeb_nickname": "스타001"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 15,
    "limit": 20,
    "has_next": false,
    "has_prev": false
  }
}
```

---

### 3.4. 사용자가 작성한 게시글 목록 조회
- **GET** `/api/users/{user_id}/posts`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- Response: 200 OK + 게시글 배열 (사용자가 작성한 게시글 목록)

```json
{
  "list": [
    {
      "post_id": 1,
      "writer_id": 1,
      "nickname": "팬001",
      "title": "내가 쓴 첫 번째 게시글",
      "created_at": "2025-07-17",
      "views": 10,
      "notice": false
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 12,
    "limit": 20,
    "has_next": false,
    "has_prev": false
  }
}
```

---

## 4. 게시판

### 4.1. 게시글 작성
- **POST** `/api/posts`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `title` | string | YES | 제목 | |
| `content` | string | YES | 내용 | |
| `notice` | boolean | YES | 공지사항여부 | |

```json
{
  "title": "새로운 게시글 제목",
  "content": "새로운 게시글 내용입니다.",
  "notice": false
}
```
- Response: 201 Created + 생성된 게시글 정보
```json
{
  "post_id": 1,
  "writer_id": 1,
  "nickname": "작성자닉네임",
  "title": "새로운 게시글 제목",
  "content": "새로운 게시글 내용입니다.",
  "created_at": "2025-07-27T00:00:00.000Z",
  "views": 0,
  "notice": false
}
```

---

### 4.2. 게시글 목록 조회
- **GET** `/api/posts`
- Query: 
  - `notice` (Boolean, Optional): 공지사항만 조회할 경우 true
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- Response: 200 OK + 게시글 배열
```json
{
  "list": [
    {
      "post_id": 1,
      "writer_id": 1,
      "nickname": "팬001",
      "title": "첫 번째 게시글입니다",
      "created_at": "2025-07-26T18:06:04.000Z",
      "views": 7,
      "notice": false
    },
    {
      "post_id": 2,
      "writer_id": 2,
      "nickname": "스타001",
      "title": "셀럽의 공지사항",
      "created_at": "2025-07-26T18:06:04.000Z",
      "views": 7,
      "notice": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 100,
    "limit": 20,
    "has_next": true,
    "has_prev": false
  }
}
```
---

### 4.3. 게시글 상세 조회
- **GET** `/api/posts/{post_id}`
- 인증 불필요
- Response: 200 OK + 게시글 내용
```json
{
    "post_id": 1,
    "writer_id": 1,
    "nickname": "팬001",
    "title": "첫 번째 게시글입니다",
    "content": "<h1>안녕하세요! 팬입니다.</h1>",
    "created_at": "2025-07-26T18:06:04.000Z",
    "views": 7,
    "notice": true
}
```

---

### 4.4. 게시글 수정
- **PATCH** `/api/posts/{post_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body
```json
{
  "title": "수정된 제목",
  "content": "수정된 내용",
  "notice": true
}
```
- Response: 200 OK + 업데이트된 게시글 정보
```json
{
    "post_id": 12,
    "writer_id": 22,
    "title": "수정된 제목",
    "content": "수정된 내용",
    "created_at": "2025-07-26T18:06:04.000Z",
    "notice": true,
    "visible": true,
    "views": 5
}
```

---

### 4.5. 게시글 삭제
- **DELETE** `/api/posts/{post_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

### 4.6. 댓글 작성
- **POST** `/api/posts/{post_id}/comments`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `content` | string | YES | 댓글내용 | |

```json
{
  "content": "댓글 내용"
}
```
- Response: 201 Created + 생성된 댓글 정보
```json
{
  "comment_id": 1,
  "post_id": 1,
  "writer_id": 1,
  "nickname": "작성자닉네임",
  "content": "댓글 내용",
  "created_at": "2025-07-27T00:00:00.000Z"
}
```

---

### 4.7. 댓글 목록 조회
- **GET** `/api/posts/{post_id}/comments`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- 인증 불필요
- Response: 200 OK + 댓글 목록

```json
{
  "list": [
    {
      "comment_id": 1,
      "post_id": 1,
      "writer_id": 1,
      "nickname": "팬001",
      "content": "첫 번째 댓글입니다.",
      "created_at": "2025-07-26T18:06:04.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 25,
    "limit": 20,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 4.8. 댓글 수정
- **PATCH** `/api/comments/{comment_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body (JSON)
```json
{
  "content": "수정된 댓글 내용"
}
```
- Response: 200 OK + 업데이트된 댓글 정보
```json
{
  "comment_id": 1,
  "post_id": 1,
  "writer_id": 1,
  "nickname": "작성자닉네임",
  "content": "수정된 댓글 내용",
  "created_at": "2025-07-26T18:06:04.000Z"
}
```

---

### 4.9. 댓글 삭제
- **DELETE** `/api/comments/{comment_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

## 5. 스케줄

### 5.1. 셀럽 스케줄 등록
- **POST** `/api/celebs/{celeb_id}/schedules`
- Header: Authorization: `Bearer <JWT_TOKEN>`

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `schedule_type` | string | YES | 타입 | |
| `start_dt` | string(ISO 8601) | YES | 시작시각 | |
| `end_dt` | string(ISO 8601) | YES | 종료시각 | |

```json
{
  "schedule_type": "콘서트",
  "start_dt": "2025-08-01T19:00:00.000Z",
  "end_dt": "2025-08-01T21:00:00.000Z"
}
```
- Response: 201 Created + 생성된 스케줄 정보
```json
{
  "schedule_id": 1,
  "celeb_id": 1,
  "schedule_type": "콘서트",
  "start_dt": "2025-08-01T19:00:00.000Z",
  "end_dt": "2025-08-01T21:00:00.000Z"
}
```

### 5.2. 셀럽 스케줄 조회
- **GET** `/api/celebs/{celeb_id}/schedules`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- 인증 불필요
- Response: 200 OK + 스케줄 목록
```json
{
  "list": [
    {
      "schedule_id": 1,
      "celeb_id": 1,
      "schedule_type": "콘서트",
      "start_dt": "2025-08-01T19:00:00.000Z",
      "end_dt": "2025-08-01T21:00:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 10,
    "limit": 20,
    "has_next": false,
    "has_prev": false
  }
}
```

### 5.3. 셀럽 스케줄 삭제
- **DELETE** `/api/celebs/schedules/{schedule_id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

## 6. 굿즈

### 6.1. 굿즈 등록
- **POST** `/api/goods`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `title` | string | YES | 판매글 제목 | |
| `content` | string | YES | 판매글 내용 | |
| `price` | double | YES | 가격 | |
| `amount` | int | YES | 수량 | |
| `notice` | boolean | YES | 공지여부 | |

```json
{
  "title": "굿즈명",
  "content": "<h1>설명은</br><b>HTML</b>입니다.</h1>",
  "price": 19900.000,
  "amount": 100,
  "notice": true
}
```
- Response: 201 Created + 생성된 굿즈 정보
```json
{
    "goods_id": 7,
    "seller_id": 24,
    "title": "굿즈명",
    "content": "<h1>설명은</br><b>HTML</b>입니다.</h1>",
    "price": 19900,
    "amount": 100,
    "created_at": "2025-07-26T19:06:54.000Z",
    "visible": true,
    "views": 0,
    "sold": false,
    "notice": true
}
```

---

### 6.2. 굿즈 목록 조회
- **GET** `/api/goods`
- Query: 
  - `seller_id` (Number, Optional): 특정 판매자의 굿즈만 조회 (생략 시 모든 판매자의 굿즈 반환)
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- 인증 불필요
- Response: 200 OK + 굿즈 배열
```json
{
  "list": [
    {
      "goods_id": 7,
      "title": "셀럽 포토북",
      "price": 19900.000,
      "amount": 100,
      "notice": true
    },
    {
      "goods_id": 8,
      "title": "포토카드 케이스",
      "price": 49900.000,
      "amount": 10,
      "notice": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 50,
    "limit": 20,
    "has_next": true,
    "has_prev": false
  }
}
```

---

### 6.3. 굿즈 상세 조회
- **GET** `/api/goods/{id}`
- 인증 불필요
- Response: 200 OK + 굿즈 정보
```json
{
  "company_name": "스타기획사",
  "celeb_type": "가수",
  "seller_nickname": "스타001",
  "title": "셀럽 포토북",
  "content": "<h1>한정판 포토북입니다.</h1>",
  "price": 19900.000,
  "amount": 100,
  "notice": true
}
```

---

### 6.4. 굿즈 수정
- **PATCH** `/api/goods/{id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body
```json
{
  "title": "수정된 굿즈명",
  "content": "수정된 설명",
  "price": 25000.000,
  "amount": 50,
  "sold": true,
  "notice": true
}
```
- Response: 200 OK + 업데이트된 굿즈 정보
```json
{
    "goods_id": 7,
    "seller_id": 24,
    "title": "수정된 굿즈명",
    "content": "수정된 설명",
    "price": 25000,
    "amount": 50,
    "created_at": "2025-07-26T19:06:54.000Z",
    "visible": true,
    "views": 2,
    "sold": true,
    "notice": true
}
```

---

### 6.5. 굿즈 삭제
- **DELETE** `/api/goods/{id}`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Response: 204 No Content

---

### 6.6. 특정 사용자가 등록한 굿즈 목록 조회
- **GET** `/api/users/{user_id}/goods`
- Query: 
  - `page` (Number, Optional): 페이지 번호 (기본값: 1)
  - `limit` (Number, Optional): 페이지당 항목 수 (기본값: 20, 최대값: 100)
- 인증 불필요
- Response: 200 OK + 굿즈 배열 (사용자가 등록한 굿즈 목록)

```json
{
  "list": [
    {
      "goods_id": 1,
      "seller_id": 2,
      "title": "셀럽 포토북",
      "content": "한정판 포토북입니다.",
      "price": 19900.000,
      "amount": 100,
      "visible": true,
      "sold": false,
      "views": 0,
      "notice": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 1,
    "total_items": 8,
    "limit": 20,
    "has_next": false,
    "has_prev": false
  }
}
```

---

## 7. 로그인 기록

### 7.1. 로그인 시 기록 저장
- **POST** `/api/logins`
- Header: Authorization: `Bearer <JWT_TOKEN>`
- Body

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `user_id` | int | YES | userid | |
| `ip_address`| string | YES | ip | |
| `user_agent` | string | YES | agent | |

```json
{
  "user_id": 1,
  "ip_address": "192.168.0.1",
  "user_agent": "Mozilla/5.0 ..."
}
```
- Response: 201 Created + 생성된 로그 정보
```json
{
  "log_id": 1
}
```

---

# 공통 오류 응답 정의

API 요청 처리 중 오류가 발생할 경우, 다음 표준 형식의 JSON 응답을 반환합니다.

## 400 Bad Request (잘못된 요청)
- **설명:** 클라이언트 요청이 유효하지 않거나, 필수 필드가 누락되었거나, 데이터 형식이 잘못된 경우.
```json
{
  "statusCode": 400,
  "message": [
    "필드명 must be a string",
    "필드명 should not be empty"
  ],
  "error": "Bad Request"
}
```

## 401 Unauthorized (인증되지 않음)
- **설명:** 유효한 인증 자격 증명(예: JWT 토큰)이 없거나, 토큰이 만료되었거나, 형식이 잘못된 경우.
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

## 403 Forbidden (접근 금지)
- **설명:** 클라이언트가 인증되었지만, 요청된 리소스에 접근할 권한이 없는 경우.
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## 404 Not Found (찾을 수 없음)
- **설명:** 요청된 리소스를 찾을 수 없는 경우.
```json
{
  "statusCode": 404,
  "message": "Cannot GET /api/nonexistent-resource",
  "error": "Not Found"
}
```

## 409 Conflict (충돌)
- **설명:** 요청이 현재 리소스의 상태와 충돌하는 경우 (예: 중복된 사용자 이름 등록).
```json
{
  "statusCode": 409,
  "message": "Username already exists",
  "error": "Conflict"
}
```

## 500 Internal Server Error (내부 서버 오류)
- **설명:** 서버에서 요청을 처리하는 동안 예상치 못한 오류가 발생한 경우.
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```
