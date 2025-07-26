# REST API 명세서

## 인증 / 사용자

### 회원가입
- **POST** `/api/users/register`
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
  "username": "celeb001",
  "password": "qwer1234",
  "mail": "celeb1@example.com",
  "nickname": "스타001",
  "dob": "1995-05-10",
  "ig_url": "https://instagram.com/star001",
  "pfp_img_url": "https://example.com/pfp1.jpg",
  "position": "celeb",
  "company_id": 1,
  "celeb_type": "가수"
}
```
- Response: 201 Created

---

### 로그인
- **POST** `/api/users/login`
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
  "user_id": 1
}
```

---

### 사용자 프로필 조회
- **GET** `/api/users/{user_id}`
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

### 사용자 정보 수정
- **PATCH** `/api/users/{user_id}`
- Header: Authorization
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

---

### 사용자 삭제
- **DELETE** `/api/users/{user_id}`
- Header: Authorization
- Response: 204 No Content

---

## 회사 / 셀럽

### 회사 등록
- **POST** `/api/companies`
- Header: Authorization (CEO 권한 필요)
- Body (JSON)

| 필드명 | 타입 | 필수 여부 | 설명 | 비고 |
| --- | --- | --- | --- | --- |
| `company_name` | string | YES | 회사명 | |
| `company_type` | string | YES | 회사 형태 | |
| `region` | string | YES | 지역명 | |

```json
{
  "company_name": "새로운기획사",
  "company_type": "엔터테인먼트",
  "region": "부산"
}
```
- Response: 201 Created + 생성된 회사 정보

---

### 회사 목록 조회
- **GET** `/api/companies`
- Query: `region=서울`
- Response: 200 OK + 회사 리스트
```json
{
  "list": [
    {
      "id": 1,
      "company_name": "스타기획사",
      "ceo_id": 3,
      "company_type": "기획사",
      "region": "서울"
    }
  ]
}
```

---

### 회사 소속된 셀럽 목록 조회
- **GET** `/api/companies/{company_id}/celebs`
- Response: 200 OK + 셀럽 정보 배열
```json
{
  "list": [
    {
      "celeb_id": 1,
      "nickname": "스타001",
      "celeb_type": "가수"
    }
  ]
}
```

---

### 셀럽 상세 조회
- **GET** `/api/celebs/{celeb_id}`
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

## 즐겨찾기

### 즐겨찾기 추가
- **POST** `/api/favorites`
- Body
```json
{
  "company_id": 1,
  "celeb_id": 1
}
```
- Response: 201 Created

---

### 즐겨찾기 삭제
- **DELETE** `/api/favorites/{favorite_id}`
- Header: Authorization
- Response: 200 OK + 삭제 메시지

---

### 사용자의 즐겨찾기 목록 조회
- **GET** `/api/users/{user_id}/favorites`
- Header: Authorization
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
  ]
}
```

---

### 사용자가 작성한 게시글 목록 조회
- **GET** `/api/users/{user_id}/posts`
- Header: Authorization
- Response: 200 OK + 게시글 배열 (사용자가 작성한 게시글 목록)

```json
{
  "list": [
    {
      "post_id": "1",
      "writer_id": "1",
      "nickname": "팬001",
      "title": "내가 쓴 첫 번째 게시글",
      "created_at": "2025-07-17",
      "views": 10,
      "notice": false
    }
  ]
}
```

---

## 게시판

### 게시글 작성
- **POST** `/api/posts`
- Header: Authorization
- Body
```json
{
  "title": "string",
  "content": "string",
  "notice": false
}
```
- Response: 201 Created

---

### 게시글 목록 조회
- **GET** `/api/posts`
- Query: `notice`(Boolean, Optional)
- Response: 200 OK + 게시글 배열
```json
{
  "list": [
    {
      "post_id": "1",
      "writer_id": "1",
      "nickname": "팬001",
      "title": "첫 번째 게시글입니다",
      "created_at": "2025-07-26T18:06:04.000Z",
      "views": 7,
      "notice": false
    },
    {
      "post_id": "2",
      "writer_id": "2",
      "nickname": "스타001",
      "title": "셀럽의 공지사항",
      "created_at": "2025-07-26T18:06:04.000Z",
      "views": 7,
      "notice": true
    }
  ]
}
```
---

### 게시글 상세 조회
- **GET** `/api/posts/{post_id}`
- Response: 200 OK + 게시글 내용
```json
{
    "post_id": "1",
    "writer_id": "1",
    "nickname": "팬001",
    "title": "첫 번째 게시글입니다",
    "content": "<h1>안녕하세요! 팬입니다.</h1>",
    "created_at": "2025-07-26T18:06:04.000Z",
    "views": 7,
    "notice": true
}
```

---

### 게시글 수정
- **PATCH** `/api/posts/{post_id}`
- Header: Authorization
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

### 게시글 삭제
- **DELETE** `/api/posts/{post_id}`
- Header: Authorization
- Response: 200 OK + 응답 메시지
```json
{
    "message": "게시글이 성공적으로 삭제되었습니다."
}
```

---

### 댓글 작성
- **POST** `/api/posts/{post_id}/comments`
- Header: Authorization
- Body (JSON)
```json
{
  "content": "댓글 내용"
}
```
- Response: 201 Created + 생성된 댓글 정보

---

### 댓글 목록 조회
- **GET** `/api/posts/{post_id}/comments`
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
  ]
}
```

---

### 댓글 수정
- **PATCH** `/api/comments/{comment_id}`
- Header: Authorization
- Body (JSON)
```json
{
  "content": "수정된 댓글 내용"
}
```
- Response: 200 OK + 업데이트된 댓글 정보

---

### 댓글 삭제
- **DELETE** `/api/comments/{comment_id}`
- Header: Authorization
- Response: 200 + 응답 메시지
```json
{
    "message": "댓글이 성공적으로 삭제되었습니다."
}
```

---

## 스케줄

### 셀럽 스케줄 등록

- **POST** `/api/celebs/{celeb_id}/schedules`
- Header: Authorization (JWT)
```json
{
  "schedule_type": "콘서트",
  "start_dt": "2025-08-01T19:00:00.000Z",
  "end_dt": "2025-08-01T21:00:00.000Z"
}
```
- Response: 201 Created + 생성된 스케줄 정보

### 셀럽 스케줄 조회
- **GET** `/api/celebs/{celeb_id}/schedules`
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
  ]
}
```

### 3. 셀럽 스케줄 삭제
- **DELETE** `/api/celebs/schedules/{schedule_id}`
- Header: Authorization (JWT)
- Response: 200 OK + 삭제 메시지
```json
{
  "message": "스케줄이 성공적으로 삭제되었습니다."
}
```

---

## 굿즈

### 굿즈 등록
- **POST** `/api/goods`
- Header: Authorization
- Body
```json
{
  "seller_id": 2,
  "title": "굿즈명",
  "content": "<h1>설명은</br><b>HTML</b>입니다.</h1>",
  "price": 19900.000,
  "amount": 100
}
```
- Response: 201 Created + json
```json
{
    "goods_id": 7,
    "seller_id": 24,
    "title": "굿즈명",
    "content": "<h1>설명은</br><b>HTML</b>입니다.</h1>",
    "price": 19900,
    "amount": 100,
    "createdt": "2025-07-26T19:06:54.000Z",
    "visible": true,
    "views": 0,
    "sold": false
}
```

---

### 굿즈 목록 조회
- **GET** `/api/goods`
- Query: `seller_id=2`
- Response: 굿즈 배열
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
  ]
}
```

---

### 굿즈 상세 조회
- **GET** `/api/goods/{id}`
- Response: 굿즈 정보
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

### 굿즈 수정
- **PATCH** `/api/goods/{id}`
- Header: Authorization
- Body
```json
{
  "title": "수정된 굿즈명",
  "content": "수정된 설명",
  "price": 25000.000,
  "amount": 50
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
    "sold": false
}
```

---

### 굿즈 삭제
- **DELETE** `/api/goods/{id}`
- Header: Authorization
- Response: 200 OK + 응답 메시지
```json
{
  "message": "굿즈가 성공적으로 삭제되었습니다."
}
```

---

### 사용자가 등록한 굿즈 목록 조회
- **GET** `/api/users/{user_id}/goods`
- Header: Authorization
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
      "views": 0
    }
  ]
}
```

---

## 로그인 기록

### 로그인 시 기록 저장
- **POST** `/api/logins`
- Body
```json
{
  "user_id": 1,
  "ip_address": "192.168.0.1",
  "user_agent": "Mozilla/5.0 ..."
}
```
- Response: 201 Created
