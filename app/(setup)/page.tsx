import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { Suspense } from "react";
import SuspenseLoader from "@/components/suspense-loader";

export default async function page() {
  const profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <InitialModal />
    </Suspense>
  );
}
