"use client";
import React from "react";
import { ImageKitProvider as IKProvider } from "@imagekit/next";

export function ImageKitProvider({ children }: { children: React.ReactNode }) {
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!urlEndpoint) {
    return <>{children}</>;
  }

  return (
    <IKProvider urlEndpoint={urlEndpoint}>
      {children}
    </IKProvider>
  );
}
