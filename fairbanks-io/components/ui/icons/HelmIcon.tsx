import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor } from "@fortawesome/free-solid-svg-icons"
import './styles.css';

export const HelmIcon = () => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faAnchor}
        className="helm-icon"
        style={{ fontSize: 42 }}
      />
    </div>
  );
};
