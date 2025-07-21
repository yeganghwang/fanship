# REST API 명세서

## 인증 / 사용자

### 회원가입
- **POST** `/api/users/register`
- Body (JSON)


| 필드명         | 타입         | 필수 여부 | 설명                  | 비고            |
| -------------- | ------------ | -------- | -----------------------| ---------------|
| `username`     | string       | YES      | 로그인 ID             |                  |
| `password`     | string       | YES      | 비밀번호              |                  |
| `mail`         | string       | YES      | 이메일 주소           |                  |
| `nickname`     | string       | YES      | 사용자 닉네임         |                  |
| `position`     | string       | YES      | 사용자 유형            |                 |
| `dob`          | string(date) | null     | 생년월일 (YYYY-MM-DD) |                  |
| `ig_url`       | string       | null     | 인스타그램 URL        |                  |
| `pfp_img_url`  | string       | null     | 프로필 이미지 URL     |                  |
| `company_code` | int          | null     | 소속 회사 코드         |                 |
| `celeb_type`   | string       | null     | 셀럽 유형              |                 |

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
  "company_code": 1,
  "celeb_type": "가수"
}
```
- Response: 201 Created

---

### 로그인
- **POST** `/api/users/login`
- Body (JSON)
  
| 필드명      | 타입    | 필수 여부 | 설명       | 비고     |
|-------------|---------|-----------|------------|----------|
| `username`  | string  | YES       | 로그인 ID   |          |
| `password`  | string  | YES       | 비밀번호    |          |
  
```json
{
  "username": "fan001",
  "password": "qwer1234!!!!"
}
```
- Response: 200 OK + JWT 토큰

---

### 사용자 프로필 조회
- **GET** `/api/users/{user_id}`
- Response
```json
{
  "nickname": "팬001",
  "position": "fan",
  "pfp_img_url": null,
  "ig_url": null,
}
```

---

## 회사 / 셀럽

### 회사 목록 조회
- **GET** `/api/companies`
- Query: `region=서울`
- Response: 200 OK + 회사 리스트

---

### 회사 소속된 셀럽 목록 조회
- **GET** `/api/celebs`
- Query: `company_id=1`
- Response: 200 OK + 셀럽 정보 배열

---

### 셀럽 상세 조회
- **GET** `/api/celebs`
- Query: `celeb_id=2`
- Response: 200 OK + 셀럽 정보
```json
{
  "nickname": "스타001",
  "celeb_type": "가수",
  "company_name": "스타기획사",
  "ig_url": "https://instagram.com/star001",
  "pfp_img_url": "http://example.com/pfp1.jpg"
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
  "user_id": 1,
  "company_id": 1,
  "celeb_id": 1
}
```
- Response: 201 Created

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
      "created_at": "2025-07-17",
      "views": 7,
      "notice": false
    },
    {
      "post_id": "2",
      "writer_id": "2",
      "nickname": "스타001",
      "title": "셀럽의 공지사항",
      "created_at": "2025-07-17",
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
    "created_at": "2025-07-17",
    "views": 7,
    "notice": true
}
```

---

## 스케줄

### 셀럽 스케줄 조회
- **GET** `/api/schedules`
- Query: `celeb_id=1`
- Response: 200 OK + 일정 목록

---

## 굿즈

### 굿즈 등록
- **POST** `/api/goods`
- Header: Authorization
- Body
```json
{
  "seller_id": 2,
  "seller_type": "celeb",
  "title": "굿즈명",
  "content": "<h1>설명은</br><b>HTML</b>입니다.</h1>",
  "price": 19900.000,
  "amount": 100
}
```
- Response: 201 Created

---

### 굿즈 목록 조회
- **GET** `/api/goods`
- Query: `seller_id=2`
- Response: 굿즈 배열
```json
{
  "list": [
    {
      "title": "셀럽 포토북",
      "price": 19900.000,
      "amount": 100,
      "notice": true
    },
    {
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
- **GET** `/api/goods`
- Query: `id=1`
- Response: 굿즈 정보
```json
{
  "company_name": "스타기획사",
  "celeb_type": "가수",
  "seller_nickname": "스타001",
  "title": "셀럽 포토북",
  "content": "<h1>한정판 포토북입니다.<h1>",
  "price": 19900.000,
  "amount": 100,
  "notice": true
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
