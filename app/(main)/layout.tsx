import React, { Suspense } from "react";

import { NavigationSideBar } from "@/components/navigation/navigation-sidebar";
import SuspenseLoader from "@/components/suspense-loader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <div className="h-full">
        <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
          <NavigationSideBar />
        </div>
        <main className="md:pl-[72px] h-full">{children}</main>
      </div>
    </Suspense>
  );
}
