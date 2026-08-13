"use client";

import { useEffect, useRef } from "react";

interface OriginalPageProps {
  head: string;
  body: string;
}

export function OriginalPage({ head, body }: OriginalPageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Execute inline and external scripts after injection.
    container.querySelectorAll("script").forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      if (oldScript.textContent) {
        newScript.textContent = oldScript.textContent;
      }
      oldScript.replaceWith(newScript);
    });
  }, [body]);

  return (
    <div
      ref={ref}
      dangerouslySetInnerHTML={{ __html: head + body }}
    />
  );
}
