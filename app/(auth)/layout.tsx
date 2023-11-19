import SuspenseLoader from "@/components/suspense-loader";
import React, { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className="h-full flex items-center justify-center">{children}</div>
    </Suspense>
  );
};

export default AuthLayout;
