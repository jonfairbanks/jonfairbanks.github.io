import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnchor } from "@fortawesome/free-solid-svg-icons"
import './styles.css';

export const HelmIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faAnchor}
      className="helm-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
    />
  );
};
