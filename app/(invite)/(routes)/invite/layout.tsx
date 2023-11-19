import SuspenseLoader from "@/components/suspense-loader";
import Image from "next/image";
import React, { Suspense } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className="h-full flex items-center justify-center">
        <Image src="/images/invite-page-bg.png" fill alt="Background" />
        {children}
      </div>
    </Suspense>
  );
}
