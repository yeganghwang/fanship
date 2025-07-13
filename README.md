# fanship
- 작성 중
---
## Tables
### tb_user
|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| user_id	 		| int						| NO	| PK		| NO 					|Auto Increment|
| username 		| varchar(255)	| NO	| UQ		| NO					|로그인 시 아이디|
| password 		| varchar(255)	| NO	| -			| YES(SHA512)	|패스워드|
| mail 				| varchar(255)	| NO	| UQ		| NO					|메일주소|
| nickname 		| varchar(12)		| NO	| UQ		| NO					|닉네임|
| dob 				| date					| NO	| - 		| NO					|생년월일(YYYY-MM-DD)|
| pfp_img_url	| varchar(255) 	| YES	| - 		| NO					|프로필 사진 링크|
| join_date		| timestamp 		| NO	| - 		| NO					|가입일|
| ig_url			| varchar(255) 	| YES	| UQ 		| NO					|인스타그램 url|
| position		| varchar(31) 	| NO	| - 		| NO					|manager, fan, celeb, ceo|

### tb_company
- 셀럽 소속 회사 정보
  
|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
| code		 		| int						| NO	| PK		| NO 	|Auto Increment|
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
| company_code	|	int						|	YES	|	FK	|	NO	|즐겨찾는 회사 코드(tb_company -> code)|
| celeb_id			| int						|	YES	|	FK	|	NO	|즐겨찾는 셀럽 아이디(tb_celeb -> celeb_id)|


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
| visible       | boolean       | NO  |  -  | NO  |삭제여부(삭제시 FALSE)|


### tb_schedule
- 스케줄

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|

### tb_goods
- 굿즈 상품

|필드명|형식|Null가능|조건|암호화|설명|
|---|---|-|-|-|---|
