import React, { useState } from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';

function UserProfileDisplay({ userProfile }) {
  const { pfp_img_url, nickname } = userProfile;

  const Avatar = ({ url, nickname, size = 120 }) => {
    const [err, setErr] = useState(false);
    const initial = (nickname || '?').trim().charAt(0).toUpperCase();
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
            overflow: 'hidden',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e2e2e2',
          margin: '0 auto'
        }}
      >
        {url && !err ? (
          <img
            src={url}
            alt={`${nickname} 프로필 이미지`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setErr(true)}
            loading="lazy"
          />
        ) : (
          <span style={{ fontSize: size * 0.38, fontWeight: 600, color: '#777' }}>{initial}</span>
        )}
      </div>
    );
  };

  return (
    <Row>
      <Col md={4} className="text-center mb-3 mb-md-0">
        <Avatar url={pfp_img_url} nickname={nickname} />
      </Col>
      <Col md={8}>
        <h3 style={{ wordBreak: 'break-word' }}>{nickname}</h3>
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
