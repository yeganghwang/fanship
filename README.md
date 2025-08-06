# fanship
- 작성 중
- 팬과 셀럽의 소통을 위한 팬덤 플랫폼
- 주요 기능
  - 사용자 관리 (회원가입, 로그인, 프로필 조회)
  - 회사 및 소속 셀럽 조회
  - 즐겨찾기 기능 (회사, 셀럽)
  - 게시판 (공지사항 포함)
  - 셀럽 스케줄 조회
  - 굿즈 판매 및 조회
  - 로그인 기록 확인
- 데이터베이스 명세 : [db_structure.md](db_structure.md)
- REST API 명세 : [api.md](api.md)
- 진행상황 : [fanship-frontend/progress.md](fanship-frontend/progress.md)
---

# 서버 - 클라이언트 환경
- 서버 : NestJS
- 클라이언트 : React

# 환경변수

## fanship-backend
`.env` 파일을 `fanship-backend` 폴더 내에 생성하고 Database와 JWT 설정 내용을 적습니다.
```bash
DB_HOST = 
DB_PORT = 
DB_USERNAME = 
DB_PASSWORD = 
DB_NAME = 

JWT_SECRET = 
JWT_EXPIRES_IN = 
```


## fanship-frontend
`.env` 파일을 `fanship-frontend` 폴더 내에 생성하고 Backend 서버의 경로를 적습니다.
```bash
REACT_APP_API_BASE_URL=http://localhost:3000/api
```