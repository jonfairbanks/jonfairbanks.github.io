import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './styles.css';

export const LinkedInIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faLinkedin}
      className="linkedin-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
    />
  );
};
