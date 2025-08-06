# fanship-frontend CSS 적용 및 스타일링 가이드

이 문서는 현재 CSS가 적용되지 않은 `fanship-frontend` 프로젝트의 컴포넌트와 페이지에 **Bootstrap**을 활용하여 세련되고 일관된 UI를 적용하는 방법을 안내합니다.

## 목표

- 모든 페이지와 컴포넌트에 일관된 디자인 시스템을 적용합니다.
- 반응형 웹 디자인을 구현하여 다양한 화면 크기(데스크톱, 태블릿, 모바일)를 지원합니다.
- 재사용 가능한 스타일 컴포넌트를 만들어 개발 효율성을 높입니다.
- 로딩, 에러, 빈 데이터 상태 등 다양한 UI 상태에 대한 시각적 피드백을 제공합니다.

---

## 1. Bootstrap 설치 및 설정

가장 먼저 프로젝트에 `react-bootstrap`과 `bootstrap`을 설치해야 합니다.

```bash
npm install react-bootstrap bootstrap
```

설치가 완료되면, 프로젝트의 진입점인 `src/index.js` 파일 상단에 Bootstrap CSS 파일을 import 합니다. 이렇게 하면 애플리케이션 전역에 Bootstrap 스타일이 적용됩니다.

**`src/index.js`**
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css'; // 이 줄을 추가하세요.
import './index.css';
import App from './App';
// ...
```

---

## 2. 전체 레이아웃 구조 개선

현재 각 페이지는 독립적으로 렌더링되고 있어 공통된 레이아웃(네비게이션 바, 푸터 등)이 없습니다. 일관된 사용자 경험을 위해 공통 `Layout` 컴포넌트를 만드는 것을 추천합니다.

1.  **`src/components/layout/` 디렉토리 생성**
2.  **`Header.js` 컴포넌트 생성**: 모든 페이지 상단에 표시될 네비게이션 바입니다.
    -   `react-bootstrap`의 `Navbar`, `Nav`, `Container` 컴포넌트를 사용합니다.
    -   로고, 주요 페이지 링크(게시판, 회사 목록, 굿즈), 로그인/로그아웃, 프로필 링크를 포함합니다.
3.  **`Footer.js` 컴포넌트 생성**: 페이지 하단에 표시될 푸터입니다.
4.  **`App.js` 수정**: `BrowserRouter` 내에서 `Header`를 렌더링하고, 각 `Route`를 `Container`로 감싸 중앙 정렬되고 깔끔한 레이아웃을 유지하도록 합니다.

**예시: `App.js` 구조**
```javascript
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/layout/Header'; // 새로 만들 컴포넌트
// ... other imports

function App() {
  // ... state and handlers
  return (
    <Router>
      <Header onLogout={handleLogout} userId={userId} />
      <Container className="mt-4">
        <Routes>
          {/* ... Route 정의 ... */}
        </Routes>
      </Container>
    </Router>
  );
}
```

---

## 3. 컴포넌트별 스타일링 적용 방안

기존 HTML 태그들을 `react-bootstrap` 컴포넌트로 교체하여 디자인을 개선합니다.

### **A. 폼 (Forms)**
-   **대상**: `LoginForm`, `RegisterForm`, `PostForm`, `GoodsForm`, `CommentForm`, `ChangePasswordForm` 등
-   **변경 사항**:
    -   `<form>` -> `<Form>`
    -   `<div>` -> `<Form.Group>`
    -   `<label>` -> `<Form.Label>`
    -   `<input>`, `<textarea>`, `<select>` -> `<Form.Control>`
    -   `<button>` -> `<Button variant="primary">`
    -   에러 메시지: `<p style={{color: 'red'}}>` -> `<Form.Text className="text-danger">`
-   **추가 개선**:
    -   폼 전체를 `<Card>`와 `<Card.Body>`로 감싸 시각적으로 분리합니다.
    -   `<Button>`에 `disabled` 속성을 그대로 활용하여 제출 버튼 비활성화를 유지합니다.

**예시: `LoginForm.js` 리팩토링**

**Before**
```javascript
<form onSubmit={handleLogin}>
  <h2>로그인</h2>
  <input type="text" placeholder="사용자 이름" ... />
  <input type="password" placeholder="비밀번호" ... />
  <button type="submit">로그인</button>
  <p>{message}</p>
</form>
```

**After**
```javascript
import { Form, Button, Card, Alert } from 'react-bootstrap';

// ...

<Card>
  <Card.Body>
    <Card.Title as="h2">로그인</Card.Title>
    <Form onSubmit={handleLogin}>
      <Form.Group className="mb-3" controlId="formBasicUsername">
        <Form.Label>사용자 이름</Form.Label>
        <Form.Control type="text" placeholder="사용자 이름" ... />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>비밀번호</Form.Label>
        <Form.Control type="password" placeholder="비밀번호" ... />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        로그인
      </Button>

      {message && <Alert variant="danger" className="mt-3">{message}</Alert>}
    </Form>
  </Card.Body>
</Card>
```

### **B. 목록 (Lists)**
-   **대상**: `PostList`, `CommentList`, `CompanyList`, `GoodsList`, `FavoriteList`
-   **변경 사항**:
    -   `<ul>`, `<li>` -> `<ListGroup>`, `<ListGroup.Item>`
    -   페이지네이션: `<button>` -> `<Pagination>` 컴포넌트 사용
    -   로딩/에러: `<div>` -> `<Spinner animation="border" />`, `<Alert variant="danger">`
-   **추가 개선**:
    -   목록 상단의 필터, 탭, 검색 영역을 `<Card.Header>`나 별도의 `<Form>`으로 구성하여 그룹화합니다.
    -   `ListGroup.Item`에 `action` prop을 추가하고 `LinkContainer`(`react-router-bootstrap` 필요)와 함께 사용하면 리스트 아이템 전체를 클릭 가능하게 만들 수 있습니다.

### **C. 상세 페이지 (Detail Pages)**
-   **대상**: `PostDetailPage`, `CelebDetailPage`, `CompanyDetailPage`, `GoodsDetailPage`
-   **변경 사항**:
    -   콘텐츠 영역을 `<Card>`로 감싸고, 제목은 `<Card.Title>`, 부가 정보는 `<Card.Subtitle className="mb-2 text-muted">`로 표시합니다.
    -   이미지: `<img>` -> `<Image fluid rounded />` (반응형 및 모서리 둥글게)
    -   버튼 그룹: 수정/삭제 버튼을 `<ButtonGroup>`으로 묶어줍니다.
-   **추가 개선**:
    -   `CelebDetailPage`나 `CompanyDetailPage`처럼 여러 정보 섹션이 있는 경우, `Row`와 `Col`을 사용하여 2단 레이아웃으로 구성할 수 있습니다. (예: 왼쪽은 프로필 이미지, 오른쪽은 상세 정보)

### **D. 페이지 (Pages)**
-   **대상**: `HomePage`, `LoginPage`, `UserProfilePage` 등 모든 페이지
-   **변경 사항**:
    -   페이지 최상위 `<div>`를 `<Container>` 또는 `<div className="container-fluid">`로 변경하여 일관된 여백과 너비를 유지합니다.
    -   `Row`와 `Col`을 사용하여 콘텐츠를 중앙에 배치하거나 그리드 레이아웃을 구성합니다.
    -   `LoginPage`의 로그인/회원가입 전환: `<Tabs>`나 `<Nav variant="pills">`를 사용하여 시각적으로 개선할 수 있습니다.

---

## 4. 실행 계획 (Action Plan)

1.  **1단계: 환경 설정**
    -   `npm install react-bootstrap bootstrap` 실행
    -   `src/index.js`에 `import 'bootstrap/dist/css/bootstrap.min.css';` 추가

2.  **2단계: 공통 레이아웃 구현**
    -   `Header.js` 컴포넌트를 `react-bootstrap/Navbar`를 사용하여 생성합니다.
    -   `App.js`를 수정하여 모든 페이지에 `Header`와 `Container`를 적용합니다.

3.  **3단계: 컴포넌트 점진적 리팩토링**
    -   가장 간단한 컴포넌트부터 시작하는 것이 좋습니다. (예: `LoginForm`)
    -   위 가이드에 따라 하나의 컴포넌트를 `react-bootstrap` 컴포넌트를 사용하도록 수정합니다.
    -   수정 후에는 웹 브라우저에서 디자인이 깨지지 않고 의도대로 표시되는지 확인합니다.
    -   이 과정을 모든 컴포넌트와 페이지에 반복 적용합니다.

4.  **4단계: 커스텀 스타일 추가**
    -   Bootstrap만으로 부족한 디자인은 `src/App.css` 또는 각 컴포넌트별 CSS 파일(`*.module.css`)을 만들어 추가 스타일을 정의합니다. 이 CSS는 Bootstrap CSS 이후에 import 되어야 스타일을 덮어쓸 수 있습니다.

이 가이드를 따라 진행하시면 `fanship-frontend` 프로젝트를 훨씬 더 세련되고 사용자 친화적인 애플리케이션으로 만드실 수 있을 것입니다.
