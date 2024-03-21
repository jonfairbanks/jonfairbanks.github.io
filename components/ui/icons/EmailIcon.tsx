'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import './styles.css';

const openEmailClient = () => {
  const encryptedEmail = 'am9uQGZhaXJiYW5rcy5pbw=='; // Replace this with your encrypted email
  const emailAddress = atob(encryptedEmail); // Decode the encrypted email
  window.location.href = `mailto:${emailAddress}`;
};

const EmailIcon = () => {
  return (
    <div>
      <FontAwesomeIcon
        icon={faEnvelope}
        className="email-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
      />
    </div>
  );
};

export const EmailComponent = () => {
  return (
    <div className="icon-container">
      <button onClick={openEmailClient}>
        <EmailIcon />
      </button>
    </div>
  );
};

