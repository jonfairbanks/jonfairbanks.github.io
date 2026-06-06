"use client";

import type { ComponentProps, ReactNode } from "react";
import { trackButtonClick, type ButtonClickTarget } from "@/utils/analytics";

type TrackedLinkProps = Omit<ComponentProps<"a">, "href" | "onClick"> & {
  analyticsLabel: string;
  analyticsTarget: ButtonClickTarget;
  children: ReactNode;
  href: string;
};

export const TrackedLink = ({
  analyticsLabel,
  analyticsTarget,
  children,
  href,
  ...props
}: TrackedLinkProps) => {
  return (
    <a
      href={href}
      onClick={() =>
        trackButtonClick({
          target: analyticsTarget,
          label: analyticsLabel,
          url: href,
        })
      }
      {...props}
    >
      {children}
    </a>
  );
};
