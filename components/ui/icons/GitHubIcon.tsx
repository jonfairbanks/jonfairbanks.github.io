import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import './styles.css';

export const GitHubIcon = () => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faGithub}
        className="github-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
      />
    </div>
  );
};
