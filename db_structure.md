## 테이블
### tb_user
|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| user_id	 		| int						| NO	| PK		| NO 					|Auto Increment|
| username 		| varchar(255)	| NO	| UQ		| NO					|로그인 시 아이디|
| password 		| varchar(255)	| NO	| -			| YES(SHA512)	|패스워드|
| mail 				| varchar(255)	| NO	| UQ		| NO					|메일주소|
| nickname 		| varchar(12)		| NO	| UQ		| NO					|닉네임|
| dob 				| date					| YES	| - 		| NO					|생년월일(YYYY-MM-DD)|
| pfp_img_url	| varchar(255) 	| YES	| - 		| NO					|프로필 사진 링크|
| join_date		| timestamp 		| NO	| - 		| NO					|가입일|
| ig_url			| varchar(255) 	| YES	| UQ 		| NO					|인스타그램 url|
| position		| varchar(31) 	| NO	| - 		| NO					|manager, fan, celeb, ceo|

### tb_company
- 셀럽 소속 회사 정보
  
|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| id  		 		| int						| NO	| PK		| NO 	|Auto Increment|
| company_name| varchar(127)	| NO	| UQ		| NO 	|회사명|
| ceo_id			| int						|	NO	|	FK		|	NO	|대표 아이디(tb_user -> user_id)|
| company_type| varchar(64)		|	NO	|	-			|			|회사형태|
| region			| varchar(8)		|	NO	| -			|	NO	|지역명|


### tb_celeb
- 셀럽 정보

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| celeb_id     | int          | NO  | PK        | NO | Auto Increment |
| user_id      | int          | NO  | FK        | NO | 셀럽의 사용자 ID(tb_user -> user_id) |
| company_code | int          | NO  | FK        | NO | 소속 회사 코드 |
| celeb_type   | varchar(64)  | NO  | -         | NO | 셀럽 형태 |



### tb_user_fav
- 사용자 즐겨찾기

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| id			 			| int						| NO	| PK	| NO 	|Auto Increment|
| user_id				| int						| NO	| FK	| NO	|사용자 아이디(tb_user -> user_id)|
| company_id  	|	int						|	YES	|	FK	|	NO	|즐겨찾는 회사 id(tb_company -> id)|
| celeb_id			| int						|	YES	|	FK	|	NO	|즐겨찾는 셀럽 id(tb_celeb -> celeb_id)|


### tb_post
- 게시글

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| id			 			| int						| NO	| PK	| NO 	|Auto Increment|
| writer_id			| int						| NO	| FK	| NO	|사용자 아이디(tb_user -> user_id)|
| title					| varchar(128)	|	NO	|	-		|	NO	|제목|
| content				| TEXT					|	NO  |	-		|	NO	|내용|
|	created_at		| timestamp			| NO  | - 	| NO	|작성일시(CURRENT_TIMESTAMP)|
| notice        | boolean       | YES | -   | NO  |공지여부|
| visible       | boolean       | NO  | -   | NO  |삭제여부(삭제시 FALSE)|
| views         | int           | NO  | -   | NO  |조회수(Default 0)|


### tb_schedule
- 스케줄

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| id            | int          | NO  | PK    | NO  |Auto Increment|
| celeb_id			| int          | NO  | FK    | NO  |셀럽 아이디(tb_celeb -> celeb_id)|
| schedule_type | varchar(64)  | NO  | -     | NO  |스케줄 형태|
| start_dt      | datetime     | NO  | -     | NO  |시작 일정 시각|
| end_dt        | datetime     | NO  | -     | NO  |종료 일정 시각|



### tb_goods
- 굿즈 상품

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| id            | int          | NO  | PK    | NO  |Auto Increment|
| seller_id     | int          | NO  | FK    | NO  |tb_user -> user_id|
| seller_type   | varchar(64)  | NO  | -     | NO  |celeb 혹은 ceo|
| title					| varchar(128) | NO  | -     | NO  |제목|
| content				| TEXT				 | NO  | -     | NO  |내용|
| price         | decimal(12,3)| NO  | -     | NO  |가격(0~999999999.999|
| amount        | int          | NO  | -     | NO  |수량|
| visible       | boolean      | NO  | -     | NO  |삭제여부(삭제시 FALSE)|
| sold          | boolean      | NO  | -     | NO  |완판여부|
| views         | int          | NO  | -     | NO  |조회수(Default 0)|

### tb_login_log
|필드명|형식|Null가능|조건|암호화|설명
|---|---|-|-|-|---|
| id            | int          | NO  | PK    | NO  |Auto Increment|
| user_id       | int          | NO  | FK    | NO  |tb_user -> user_id|
| login_time    | timestamp    | NO  | -     | NO  |CURRENT_TIMESTAMP|
| ip_address    | varchar(45)  | YES | -     | NO  |ip 주소|
| user_agent    | TEXT         | YES | -     | NO  |사용자 에이전트|

## 테이블 생성 SQL
``` sql
-- 사용자 테이블
CREATE TABLE tb_user (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    mail VARCHAR(255) NOT NULL UNIQUE,
    nickname VARCHAR(12) NOT NULL UNIQUE,
    dob DATE,
    pfp_img_url VARCHAR(255),
    join_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ig_url VARCHAR(255) UNIQUE,
    position VARCHAR(31) NOT NULL
);

-- 회사 테이블
CREATE TABLE tb_company (
    id INT PRIMARY KEY AUTO_INCREMENT,
    company_name VARCHAR(128) NOT NULL UNIQUE,
    ceo_id INT NOT NULL,
    company_type VARCHAR(64) NOT NULL,
    region VARCHAR(8) NOT NULL,
    FOREIGN KEY (ceo_id) REFERENCES tb_user(user_id)
);

-- 셀럽 테이블
CREATE TABLE tb_celeb (
    celeb_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_code INT NOT NULL,
    celeb_type VARCHAR(64) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (company_code) REFERENCES tb_company(id)
);

-- 즐겨찾기 테이블
CREATE TABLE tb_user_fav (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    company_id INT,
    celeb_id INT,
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id),
    FOREIGN KEY (company_id) REFERENCES tb_company(id),
    FOREIGN KEY (celeb_id) REFERENCES tb_celeb(celeb_id)
);

-- 게시글 테이블
CREATE TABLE tb_post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    writer_id INT NOT NULL,
    title VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notice BOOLEAN NOT NULL DEFAULT FALSE,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    views INT NOT NULL DEFAULT 0,
    FOREIGN KEY (writer_id) REFERENCES tb_user(user_id)
);

-- 스케줄 테이블
CREATE TABLE tb_schedule (
    id INT PRIMARY KEY AUTO_INCREMENT,
    celeb_id INT NOT NULL,
    schedule_type VARCHAR(64) NOT NULL,
    start_dt DATETIME NOT NULL,
    end_dt DATETIME,
    FOREIGN KEY (celeb_id) REFERENCES tb_celeb(celeb_id)
);

-- 굿즈 상품 테이블
CREATE TABLE tb_goods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    seller_id INT NOT NULL,
    seller_type VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    content TEXT NOT NULL,
    price DECIMAL(12,3) NOT NULL,
    amount INT NOT NULL,
    visible BOOLEAN NOT NULL DEFAULT TRUE,
    views INT NOT NULL DEFAULT 0,
    sold BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (seller_id) REFERENCES tb_user(user_id)
);

-- 로그인 기록 테이블
CREATE TABLE tb_login_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    login_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    FOREIGN KEY (user_id) REFERENCES tb_user(user_id)
);


```

## Sample Data
``` sql
-- tb_user 샘플 데이터
INSERT INTO tb_user (username, password, mail, nickname, dob, pfp_img_url, join_date, ig_url, position) VALUES
('fan001', 'sha512_hashed_pw1', 'fan1@example.com', '팬001', '2000-01-01', NULL, NOW(), NULL, 'fan'),
('celeb001', 'sha512_hashed_pw2', 'celeb1@example.com', '스타001', '1995-05-20', 'http://example.com/pfp1.jpg', NOW(), 'https://instagram.com/star001', 'celeb'),
('ceo001', 'sha512_hashed_pw3', 'ceo1@example.com', '대표001', '1980-10-10', NULL, NOW(), 'https://instagram.com/ceo001', 'ceo');

-- tb_company 샘플 데이터
INSERT INTO tb_company (company_name, ceo_id, company_type, region) VALUES
('스타기획사', 3, '기획사', '서울');

-- tb_celeb 샘플 데이터
INSERT INTO tb_celeb (user_id, company_code, celeb_type) VALUES
(2, 1, '가수');

-- tb_user_fav 샘플 데이터
INSERT INTO tb_user_fav (user_id, company_id, celeb_id) VALUES
(1, 1, 1);

-- tb_post 샘플 데이터
INSERT INTO tb_post (writer_id, title, content, created_at, notice, visible) VALUES
(1, '첫 번째 게시글입니다', '<h1>안녕하세요! 팬입니다.</h1>', NOW(), FALSE, TRUE),
(2, '셀럽의 공지사항', '스케줄 변경이 있습니다.', NOW(), TRUE, TRUE);

-- tb_schedule 샘플 데이터
INSERT INTO tb_schedule (celeb_id, schedule_type, start_dt, end_dt) VALUES
(1, '콘서트', '2025-08-01 19:00:00', '2025-08-01 21:00:00');

-- tb_goods 샘플 데이터
INSERT INTO tb_goods (seller_id, seller_type, title, content, price, amount, visible, sold) VALUES
(2, 'celeb', '셀럽 포토북', '한정판 포토북입니다.', 19900.000, 100, TRUE, FALSE),
(3, 'ceo', '굿즈 패키지', '팬들을 위한 종합 굿즈 패키지입니다.', 49900.000, 50, TRUE, FALSE);

```
