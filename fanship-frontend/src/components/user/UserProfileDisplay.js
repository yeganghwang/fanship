import React from 'react';
import { Row, Col, Image, ListGroup } from 'react-bootstrap';

function UserProfileDisplay({ userProfile }) {
  return (
    <Row>
      <Col md={4} className="text-center">
        <Image 
          src={userProfile.pfp_img_url || 'https://via.placeholder.com/150'} 
          roundedCircle 
          fluid 
          style={{ width: '150px', height: '150px', objectFit: 'cover' }}
        />
      </Col>
      <Col md={8}>
        <h3>{userProfile.nickname}</h3>
        <ListGroup variant="flush">
          <ListGroup.Item><strong>사용자 유형:</strong> {userProfile.position}</ListGroup.Item>
          {userProfile.ig_url && (
            <ListGroup.Item>
              <strong>인스타그램:</strong> <a href={userProfile.ig_url} target="_blank" rel="noopener noreferrer">{userProfile.ig_url}</a>
            </ListGroup.Item>
          )}
        </ListGroup>
      </Col>
    </Row>
  );
}

export default UserProfileDisplay;
