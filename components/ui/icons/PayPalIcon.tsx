import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';
import './styles.css';

export const PayPalIcon = () => {
  return (
    <div className="icon-container">
      <FontAwesomeIcon
        icon={faPaypal}
        className="paypal-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
      />
    </div>
  );
};
