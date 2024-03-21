import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDocker } from '@fortawesome/free-brands-svg-icons';
import './styles.css';

export const DockerIcon = () => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faDocker}
        className="docker-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
      />
    </div>
  );
};
