"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type ButtonClickTarget =
  | "github"
  | "linkedin"
  | "paypal"
  | "helm_charts"
  | "docker_hub"
  | "email";

type ButtonClickEvent = {
  target: ButtonClickTarget;
  label: string;
  url: string;
};

export const trackButtonClick = ({ target, label, url }: ButtonClickEvent) => {
  sendGAEvent("event", "button_click", {
    button_target: target,
    button_label: label,
    link_url: url,
  });
};
