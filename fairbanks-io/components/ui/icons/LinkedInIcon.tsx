import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './styles.css';

export const LinkedInIcon = () => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faLinkedin}
        className="linkedin-icon"
        style={{ fontSize: 42 }}
      />
    </div>
  );
};
