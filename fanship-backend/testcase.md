# API Test Cases

This document outlines the expected input and output for each API endpoint, based on the `api.md` specification.

## 1. 인증 / 사용자

### 1.1. 회원가입 (POST /api/auth/register)
- **Description:** 새로운 사용자를 등록합니다.
- **Input:**
  - **Headers:** None
  - **Body (JSON):**
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
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "user_id": 1, // 서버에서 자동 생성
      "username": "test_user_register",
      "mail": "test_register@example.com",
      "nickname": "테스트유저",
      "position": "fan",
      "dob": "2000-01-01",
      "ig_url": "https://instagram.com/test_register",
      "pfp_img_url": "https://example.com/test_register.jpg",
      "join_dt": "2025-07-27T00:00:00.000Z" // 서버에서 자동 생성
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식 (예: `nickname` 길이 초과)
  - **409 Conflict:** `username`, `mail`, `nickname`, `ig_url` 중복

- **Result:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "user_id": 38, // 예시 ID
      "username": "testuser_12353",
      "password": "$2b$10$YWV/.ABO6OZ4TYSXib4mMO3gTOp1Z6BEzu83cuLZgkr40w/20xP2q", // 해싱된 비밀번호
      "mail": "testuser_12353@example.com",
      "nickname": "test_user_3",
      "dob": "2000-01-01",
      "pfp_img_url": "https://example.com/test_user_3.jpg",
      "join_dt": "2025-07-27T06:21:20.000Z", // 서버에서 자동 생성
      "ig_url": "https://instagram.com/test_user_3",
      "position": "fan"
    }
    ```

### 1.2. 로그인 (POST /api/auth/login)
- **Description:** 사용자 로그인 및 JWT 토큰 발급.
- **Input:**
  - **Headers:** None
  - **Body (JSON):**
    ```json
    {
      "username": "existing_user",
      "password": "correct_password"
    }
    ```
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // 실제 JWT 토큰
      "user_id": 1 // 로그인한 사용자의 ID
    }
    ```
- **Error Cases:**
  - **401 Unauthorized:** 잘못된 `username` 또는 `password`

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3RfdXNlcl9yZWdpc3RlciIsInN1YiI6MzksImlhdCI6MTc1MzU5Nzg4OSwiZXhwIjoxNzUzNjAxNDg5fQ.ux668eKmCLT4Tok79BSobN2fYieAJpn_atwqBC3wr5E",
      "user_id": 39
    }
    ```

### 1.3. 사용자 프로필 조회 (GET /api/users/{user_id})
- **Description:** 특정 사용자의 프로필 정보를 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (조회할 사용자의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
      "nickname": "팬001",
      "position": "fan",
      "pfp_img_url": null,
      "ig_url": null
    }
    ```
- **Error Cases:**
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "nickname": "테스트유저",
    "position": "fan",
    "pfp_img_url": "https://example.com/test_register.jpg",
    "ig_url": "https://instagram.com/test_register"
    }
    ```


### 1.4. 사용자 정보 수정 (PATCH /api/users/{user_id})
- **Description:** 인증된 사용자의 정보를 수정합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (수정할 사용자의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "nickname": "새로운닉네임",
      "pfp_img_url": "https://example.com/new_pfp.jpg"
    }
    ```
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
      "nickname": "새로운닉네임",
      "position": "fan", // 다른 필드들도 포함될 수 있음
      "pfp_img_url": "https://example.com/new_pfp.jpg",
      "ig_url": null
      // ... 업데이트된 사용자 정보
    }
    ```
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 정보를 수정하려는 경우
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우
  - **409 Conflict:** `nickname` 또는 `ig_url`이 이미 존재하는 경우

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "user_id": 39,
    "username": "test_user_register",
    "password": "$2b$10$a0bZ7M41u1.Yw7MlXkhwQuMblIlD.x4utdhelZ6smtSErtG.mv3za",
    "mail": "test_register@example.com",
    "nickname": "새로운닉네임",
    "dob": "2000-01-01",
    "pfp_img_url": "https://example.com/new_pfp.jpg",
    "join_dt": "2025-07-27T06:23:31.000Z",
    "ig_url": "https://instagram.com/test_register",
    "position": "fan"
    }
    ```


### 1.5. 사용자 삭제 (DELETE /api/users/{user_id})
- **Description:** (구현 안 할 예정) 특정 사용자를 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (삭제할 사용자의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자를 삭제하려는 경우
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

## 2. 회사 / 셀럽

### 2.1. 회사 등록 (POST /api/companies)
- **Description:** 새로운 회사를 등록합니다.
- **Input:**
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>` (CEO 권한 필요)
  - **Body (JSON):**
    ```json
    {
      "company_name": "새로운기획사",
      "company_type": "엔터테인먼트",
      "region": "부산"
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "company_id": 1, // 생성된 회사의 ID
      "company_name": "새로운기획사",
      "ceo_id": 3, // 등록한 CEO의 ID
      "company_type": "엔터테인먼트",
      "region": "부산"
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** CEO 권한이 없는 경우
  - **409 Conflict:** 회사 이름 중복되는 경우

- **Result:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
    "company_id": 10,
    "company_name": "새로운기획사",
    "ceo_id": 39,
    "company_type": "엔터테인먼트",
    "region": "부산"
    }
    ```

### 2.2. 회사 목록 조회 (GET /api/companies)
- **Description:** 회사 목록을 조회합니다.
- **Input:**
  - **Query Parameters:**
    - `region`: 서울 (Optional: 생략 시 모든 회사 정보 반환)
  - **Headers:** None
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:** None explicitly defined, but could be 500 Internal Server Error.

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "list": [
        {
            "id": 10,
            "company_name": "새로운기획사",
            "ceo_id": 39,
            "company_type": "엔터테인먼트",
            "region": "부산"
        },
        {
            "id": 11,
            "company_name": "ㅁㅁㅋ",
            "ceo_id": 38,
            "company_type": "엔터테인먼트",
            "region": "부산"
        }
    ]
  }
    ```

### 2.3. 회사 소속된 셀럽 목록 조회 (GET /api/companies/{company_id}/celebs)
- **Description:** 특정 회사에 소속된 셀럽 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `company_id`: 1 (조회할 회사의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `company_id`에 해당하는 회사가 없는 경우


- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "list": [
        {
            "celeb_id": 10,
            "nickname": "celeb1",
            "celeb_type": "가수"
        }
    ]
    }
    ```


### 2.4. 셀럽 상세 조회 (GET /api/celebs/{celeb_id})
- **Description:** 특정 셀럽의 상세 정보를 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `celeb_id`: 1 (조회할 셀럽의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `celeb_id`에 해당하는 셀럽이 없는 경우

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "nickname": "celeb1",
    "celeb_type": "가수",
    "company_name": "새로운기획사",
    "ig_url": "https://instagram.com/celeb1",
    "pfp_img_url": "https://example.com/test_register.jpg",
    "dob": "2000-01-01"
    }
    ```


## 3. 즐겨찾기

### 3.1. 즐겨찾기 추가 (POST /api/favorites)
- **Description:** 사용자의 즐겨찾기 목록에 회사 또는 셀럽을 추가합니다.
- **Input:**
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "company_id": 1
    }
    ```
    또는
    ```json
    {
      "celeb_id": 1
    }
    ```
  - **Note:** `company_id`, `celeb_id` 둘 중 하나만 포함되어 있어야 함.
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body:** (Empty or minimal success message, not explicitly defined in api.md, but 201 usually returns created resource or ID)
    ```json
    {
      "favorite_id": 1 // 예시 ID
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** `company_id`와 `celeb_id`가 모두 있거나 모두 없는 경우
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **404 Not Found:** `company_id` 또는 `celeb_id`에 해당하는 리소스가 없는 경우
  - **409 Conflict:** 이미 즐겨찾기에 추가된 경우

- **Result:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
   {
    "favorite_id": 21
   }
    ```

### 3.2. 즐겨찾기 삭제 (DELETE /api/favorites/{favorite_id})
- **Description:** 사용자의 즐겨찾기 목록에서 항목을 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `favorite_id`: 1 (삭제할 즐겨찾기 항목의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 즐겨찾기를 삭제하려는 경우
  - **404 Not Found:** `favorite_id`에 해당하는 즐겨찾기 항목이 없는 경우

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "message": "즐겨찾기가 성공적으로 삭제되었습니다."
    }
    ```

### 3.3. 사용자의 즐겨찾기 목록 조회 (GET /api/users/{user_id}/favorites)
- **Description:** 특정 사용자의 즐겨찾기 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (조회할 사용자의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 즐겨찾기 목록을 조회하려는 경우
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우

- **Result:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
    "list": [
        {
            "favorite_id": 19,
            "user_id": 41,
            "company_id": null,
            "celeb_id": 11,
            "company_name": null,
            "celeb_nickname": "테스트celeb1"
        },
        {
            "favorite_id": 20,
            "user_id": 41,
            "company_id": 12,
            "celeb_id": null,
            "company_name": "새로운기획사",
            "celeb_nickname": null
        }
    ]
    }
    ```

### 3.4. 사용자가 작성한 게시글 목록 조회 (GET /api/users/{user_id}/posts)
- **Description:** 특정 사용자가 작성한 게시글 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (조회할 사용자의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
      ]
    }
    ```
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 게시글 목록을 조회하려는 경우
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

## 4. 게시판

### 4.1. 게시글 작성 (POST /api/posts)
- **Description:** 새로운 게시글을 작성합니다.
- **Input:**
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "title": "새로운 게시글 제목",
      "content": "새로운 게시글 내용입니다.",
      "notice": false
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):** (api.md에 응답 예시 없음, 생성된 리소스의 ID 또는 전체 리소스 반환 예상)
    ```json
    {
      "post_id": 1, // 생성된 게시글 ID
      "writer_id": 1, // 작성자 ID (인증 토큰에서 추출)
      "nickname": "작성자닉네임",
      "title": "새로운 게시글 제목",
      "content": "새로운 게시글 내용입니다.",
      "created_at": "2025-07-27T00:00:00.000Z",
      "views": 0,
      "notice": false
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.2. 게시글 목록 조회 (GET /api/posts)
- **Description:** 게시글 목록을 조회합니다.
- **Input:**
  - **Query Parameters:**
    - `notice`: true (Optional: `true`인 경우 공지사항만, 생략 시 모든 게시글 반환)
  - **Headers:** None
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
      ]
    }
    ```
- **Error Cases:** None explicitly defined.

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.3. 게시글 상세 조회 (GET /api/posts/{post_id})
- **Description:** 특정 게시글의 상세 내용을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `post_id`: 1 (조회할 게시글의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `post_id`에 해당하는 게시글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.4. 게시글 수정 (PATCH /api/posts/{post_id})
- **Description:** 특정 게시글의 내용을 수정합니다.
- **Input:**
  - **Path Parameters:**
    - `post_id`: 1 (수정할 게시글의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "title": "수정된 제목",
      "content": "수정된 내용",
      "notice": true
    }
    ```
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **400 Bad Request:** 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 게시글을 수정하려는 경우
  - **404 Not Found:** `post_id`에 해당하는 게시글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.5. 게시글 삭제 (DELETE /api/posts/{post_id})
- **Description:** 특정 게시글을 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `post_id`: 1 (삭제할 게시글의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 게시글을 삭제하려는 경우
  - **404 Not Found:** `post_id`에 해당하는 게시글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.6. 댓글 작성 (POST /api/posts/{post_id}/comments)
- **Description:** 특정 게시글에 댓글을 작성합니다.
- **Input:**
  - **Path Parameters:**
    - `post_id`: 1 (댓글을 작성할 게시글의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "content": "새로운 댓글 내용"
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "comment_id": 1, // 생성된 댓글 ID
      "post_id": 1,
      "writer_id": 1, // 작성자 ID (인증 토큰에서 추출)
      "nickname": "작성자닉네임",
      "content": "새로운 댓글 내용",
      "created_at": "2025-07-27T00:00:00.000Z"
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **404 Not Found:** `post_id`에 해당하는 게시글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.7. 댓글 목록 조회 (GET /api/posts/{post_id}/comments)
- **Description:** 특정 게시글의 댓글 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `post_id`: 1 (댓글 목록을 조회할 게시글의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `post_id`에 해당하는 게시글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.8. 댓글 수정 (PATCH /api/comments/{comment_id})
- **Description:** 특정 댓글의 내용을 수정합니다.
- **Input:**
  - **Path Parameters:**
    - `comment_id`: 1 (수정할 댓글의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "content": "수정된 댓글 내용"
    }
    ```
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
    ```json
    {
      "comment_id": 1,
      "post_id": 1, // 관련 게시글 ID
      "writer_id": 1, // 작성자 ID
      "nickname": "작성자닉네임",
      "content": "수정된 댓글 내용",
      "created_at": "2025-07-26T18:06:04.000Z" // 또는 updated_at
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 댓글을 수정하려는 경우
  - **404 Not Found:** `comment_id`에 해당하는 댓글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 4.9. 댓글 삭제 (DELETE /api/comments/{comment_id})
- **Description:** 특정 댓글을 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `comment_id`: 1 (삭제할 댓글의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 댓글을 삭제하려는 경우
  - **404 Not Found:** `comment_id`에 해당하는 댓글이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

## 5. 스케줄

### 5.1. 셀럽 스케줄 등록 (POST /api/celebs/{celeb_id}/schedules)
- **Description:** 특정 셀럽의 새로운 스케줄을 등록합니다.
- **Input:**
  - **Path Parameters:**
    - `celeb_id`: 1 (스케줄을 등록할 셀럽의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "schedule_type": "콘서트",
      "start_dt": "2025-08-01T19:00:00.000Z",
      "end_dt": "2025-08-01T21:00:00.000Z"
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "schedule_id": 1, // 생성된 스케줄 ID
      "celeb_id": 1,
      "schedule_type": "콘서트",
      "start_dt": "2025-08-01T19:00:00.000Z",
      "end_dt": "2025-08-01T21:00:00.000Z"
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 스케줄 등록 권한이 없는 경우 (예: 해당 셀럽의 소속사 CEO가 아닌 경우)
  - **404 Not Found:** `celeb_id`에 해당하는 셀럽이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 5.2. 셀럽 스케줄 조회 (GET /api/celebs/{celeb_id}/schedules)
- **Description:** 특정 셀럽의 스케줄 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `celeb_id`: 1 (스케줄을 조회할 셀럽의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `celeb_id`에 해당하는 셀럽이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 5.3. 셀럽 스케줄 삭제 (DELETE /api/celebs/schedules/{schedule_id})
- **Description:** 특정 셀럽의 스케줄을 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `schedule_id`: 1 (삭제할 스케줄의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 스케줄 삭제 권한이 없는 경우
  - **404 Not Found:** `schedule_id`에 해당하는 스케줄이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

## 6. 굿즈

### 6.1. 굿즈 등록 (POST /api/goods)
- **Description:** 새로운 굿즈를 등록합니다.
- **Input:**
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
    ```json
    {
      "title": "새로운 굿즈명",
      "content": "<h1>새로운 굿즈 설명입니다.</h1>",
      "price": 19900.000,
      "amount": 100,
      "notice": true
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body (JSON):**
    ```json
    {
      "goods_id": 7,
      "seller_id": 24, // 인증 토큰에서 추출된 판매자 ID
      "title": "새로운 굿즈명",
      "content": "<h1>새로운 굿즈 설명입니다.</h1>",
      "price": 19900,
      "amount": 100,
      "created_at": "2025-07-27T00:00:00.000Z",
      "visible": true,
      "views": 0,
      "sold": false,
      "notice": true
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 굿즈 등록 권한이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 6.2. 굿즈 목록 조회 (GET /api/goods)
- **Description:** 굿즈 목록을 조회합니다.
- **Input:**
  - **Query Parameters:**
    - `seller_id`: 2 (Optional: 생략 시 모든 판매자의 굿즈 반환)
  - **Headers:** None
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:** None explicitly defined.

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 6.3. 굿즈 상세 조회 (GET /api/goods/{id})
- **Description:** 특정 굿즈의 상세 정보를 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `id`: 1 (조회할 굿즈의 ID)
  - **Headers:** None (인증 불필요)
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **404 Not Found:** `id`에 해당하는 굿즈가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 6.4. 굿즈 수정 (PATCH /api/goods/{id})
- **Description:** 특정 굿즈의 정보를 수정합니다.
- **Input:**
  - **Path Parameters:**
    - `id`: 1 (수정할 굿즈의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
  - **Body (JSON):**
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
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
- **Error Cases:**
  - **400 Bad Request:** 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 굿즈를 수정하려는 경우
  - **404 Not Found:** `id`에 해당하는 굿즈가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 6.5. 굿즈 삭제 (DELETE /api/goods/{id})
- **Description:** 특정 굿즈를 삭제합니다.
- **Input:**
  - **Path Parameters:**
    - `id`: 1 (삭제할 굿즈의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 204 No Content
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 굿즈를 삭제하려는 경우
  - **404 Not Found:** `id`에 해당하는 굿즈가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

### 6.6. 사용자가 등록한 굿즈 목록 조회 (GET /api/users/{user_id}/goods)
- **Description:** 특정 사용자가 등록한 굿즈 목록을 조회합니다.
- **Input:**
  - **Path Parameters:**
    - `user_id`: 1 (조회할 사용자의 ID)
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>`
- **Expected Output:**
  - **Status Code:** 200 OK
  - **Body (JSON):**
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
      ]
    }
    ```
- **Error Cases:**
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우
  - **403 Forbidden:** 다른 사용자의 굿즈 목록을 조회하려는 경우
  - **404 Not Found:** `user_id`에 해당하는 사용자가 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

## 7. 로그인 기록

### 7.1. 로그인 시 기록 저장 (POST /api/logins)
- **Description:** 사용자 로그인 시 로그인 기록을 저장합니다.
- **Input:**
  - **Headers:**
    - `Authorization`: `Bearer <JWT_TOKEN>` (서버 내부에서 호출될 가능성 높음)
  - **Body (JSON):**
    ```json
    {
      "user_id": 1,
      "ip_address": "192.168.0.1",
      "user_agent": "Mozilla/5.0 ..."
    }
    ```
- **Expected Output:**
  - **Status Code:** 201 Created
  - **Body:** (Empty or minimal success message, not explicitly defined in api.md)
    ```json
    {
      "log_id": 1 // 예시 ID
    }
    ```
- **Error Cases:**
  - **400 Bad Request:** 필수 필드 누락, 잘못된 형식
  - **401 Unauthorized:** 유효하지 않거나 토큰이 없는 경우

- **Result:**
  - **Status Code:** 
  - **Body (JSON):**
    ```json
    ```

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
