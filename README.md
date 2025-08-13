# fanship

팬과 셀럽(및 회사) 간 소통과 활동을 지원하는 팬덤 플랫폼입니다.

## 주요 기능 (Features)
- 사용자 관리: 회원가입, 로그인, 프로필 조회/수정, 비밀번호 변경
- 회사 & 셀럽 조회 (소속 구조 탐색)
- 즐겨찾기(회사 / 셀럽 / 기타 리소스)
- 게시판 (공지사항 포함), 댓글
- 셀럽 스케줄 조회
- 굿즈(상품) 목록 / 상세 / 사용자별 보유 현황

## 문서
- 데이터베이스 구조: [db_structure.md](db_structure.md)
- REST API 명세: [api.md](api.md)
- 프론트 진행 상황: [fanship-frontend/progress.md](fanship-frontend/progress.md)

## 기술 스택 (Tech Stack)
| Layer | Stack |
|-------|-------|
| Backend | NestJS (Node 20), TypeScript, JWT, (DB: MySQL or MariaDB / Port 3000 내외) |
| Frontend | React (CRA), Axios, React Router |
| Infra | Docker, docker compose, GitHub Actions (CI/CD), Nginx (정적 서빙 + 프록시) |

## 디렉터리 구조 (요약)
```
fanship/
  fanship-backend/        # NestJS 서비스 (Dockerfile 포함)
  fanship-frontend/       # React + Nginx (Dockerfile, nginx.conf)
  docker-compose.yml      # 통합 실행 (api + frontend)
  backend.env             # 백엔드 환경변수
  .env                    # 프론트 환경변수
  .github/workflows/      # CI/CD 파이프라인
```

## 환경 변수 (Environment Variables)
환경 변수는 "빌드 타임"(프론트)과 "런타임"(백엔드) 용도를 분리합니다.

### 1. Backend (개발 시 `fanship-backend/.env`)
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=
JWT_SECRET=
JWT_EXPIRES_IN=
RECAPTCHA_SECRET_KEY=
```
로컬 개발 실행:
```
cd fanship-backend
npm ci
npm run start:dev
```

### 2. Frontend (개발 시 `fanship-frontend/.env`)
```
REACT_APP_API_BASE_URL=http://<host>:<port>/api
REACT_APP_SERVER_URL=http://<host>:<port>
REACT_APP_RECAPTCHA_SITE_KEY=<site-key>
```
로컬 개발 실행:
```
cd fanship-frontend
npm install
npm start
```

### 3. 배포 (루트 `.env` + `backend.env`)
프론트 빌드 타임 변수는 루트 `.env`
```
REACT_APP_API_BASE_URL=https://<domain>/api
REACT_APP_SERVER_URL=https://<domain>
REACT_APP_RECAPTCHA_SITE_KEY=<site-key>
DOCKER_REGISTRY=<registry-host>
```
백엔드 런타임 변수는 루트 `backend.env` 
```
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_NAME=fanship
JWT_SECRET=
JWT_EXPIRES_IN=1h
RECAPTCHA_SECRET_KEY=
```

## Docker / Compose
통합 실행 (로컬 테스트)
```
docker compose build --no-cache
docker compose up -d
```
중단:
```
docker compose down
```
로그:
```
docker logs -f fanship-api
docker logs -f fanship-frontend
```

### 이미지 구성
- 백엔드: 멀티 스테이지 (builder → production) / `node:20-alpine`
- 프론트: 빌드 stage(CRA) → Nginx 서빙 / `node:18` + `nginx:alpine`

### Nginx (프론트)
`/api/` 경로는 내부 docker 네트워크의 `api:3000` 으로 프록시, 나머지 경로는 SPA fallback ( `/index.html` ).

## CI/CD (GitHub Actions)
워크플로(`.github/workflows/deploy.yml`) 개요:
1. main 브랜치 push 또는 수동 dispatch 트리거
2. 프론트 빌드 (CRA) & 백엔드 빌드 (tsc)
3. Docker 이미지 2종 빌드 & 레지스트리 push (`<registry>/fanship-backend:latest`, `<registry>/fanship-frontend:latest`)
4. SSH 배포: 원격 서버에서 pull → `docker compose down` → `docker compose up -d --force-recreate`

Secrets
```
DOCKER_REGISTRY,
DOCKER_USERNAME,
DOCKER_PASSWORD,

REACT_APP_API_BASE_URL,
REACT_APP_SERVER_URL,
REACT_APP_RECAPTCHA_SITE_KEY,

DB_HOST,
DB_PORT,
DB_USERNAME,
DB_PASSWORD,

JWT_SECRET,
JWT_EXPIRES_IN,
RECAPTCHA_SECRET_KEY,

DEPLOY_HOST,
DEPLOY_USER,
DEPLOY_PORT,
DEPLOY_SSH_KEY,
DEPLOY_PATH
```

## 트러블슈팅 요약
| 증상 | 원인 | 해결 |
|------|------|------|
| 프론트 새로고침 404 | SPA fallback 미설정 | nginx.conf `try_files $uri /index.html;` |
| 프론트 API 주소가 예전 값 | 캐시된 정적 번들 | `--no-cache` 재빌드, 이미지 삭제 후 재생성 |
| CI 빌드 실패 (eslint 경고) | CRA `CI=true` | 워크플로에서 `CI=false` 또는 경고 제거 |
| 배포 SSH 단계 docker not found | PATH 또는 비로그인 셸 | 절대경로 `/usr/local/bin/docker` 사용 or PATH 추가 |


## 빠른 실행 요약
```
git clone https://github.com/yeganghwang/fanship

vi fanship/backend.env
vi fanship/.env
vi fanship/fanship-frontend/.env
vi fanship/fanship-backend/.env

docker compose up --build
```