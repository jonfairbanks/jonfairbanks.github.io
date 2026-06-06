'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { trackButtonClick } from "@/utils/analytics";
import './styles.css';

const openEmailClient = (event: React.MouseEvent<HTMLButtonElement>) => {
  const encryptedEmail = 'am9uQGZhaXJiYW5rcy5pbw=='; // Replace this with your encrypted email
  const emailAddress = atob(encryptedEmail); // Decode the encrypted email
  trackButtonClick({
    target: "email",
    label: "Email Jon Fairbanks",
    url: `mailto:${emailAddress}`,
  });

  if (event.defaultPrevented) {
    return;
  }

  window.location.href = `mailto:${emailAddress}`;
};

const EmailIcon = () => {
  return (
    <FontAwesomeIcon
      icon={faEnvelope}
      className="email-icon text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
    />
  );
};

export const EmailComponent = () => {
  return (
    <button onClick={openEmailClient} aria-label="Email Jon Fairbanks">
      <EmailIcon />
    </button>
  );
};
