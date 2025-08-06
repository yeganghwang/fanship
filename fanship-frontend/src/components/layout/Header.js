import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Header({ onLogout, userId }) {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand>Fanship</Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/posts">
              <Nav.Link>게시판</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/companies">
              <Nav.Link>회사 목록</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/goods">
              <Nav.Link>굿즈</Nav.Link>
            </LinkContainer>
          </Nav>
          <Nav>
            {userId ? (
              <>
                <LinkContainer to="/profile">
                  <Nav.Link>내 프로필</Nav.Link>
                </LinkContainer>
                <LinkContainer to="/favorites">
                  <Nav.Link>즐겨찾기</Nav.Link>
                </LinkContainer>
                <Nav.Link onClick={onLogout}>로그아웃</Nav.Link>
              </>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>로그인</Nav.Link>
              </LinkContainer>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
