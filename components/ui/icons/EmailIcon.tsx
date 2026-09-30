"use client";

import React from "react";
import { trackButtonClick } from "@/utils/analytics";

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

export const EmailComponent = () => {
  return (
    <button
      className="email-action"
      onClick={openEmailClient}
      aria-label="Email Jon Fairbanks"
    >
      Email me
    </button>
  );
};
