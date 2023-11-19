import Image from "next/image";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex items-center justify-center">
      <Image src="/images/invite-page-bg.png" fill alt="Background" />
      {children}
    </div>
  );
}
