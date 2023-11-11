import { redirectToSignIn } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-profile";

import { ConfirmJoinServerModal } from "@/components/modals/confirm-join-server-modal";

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
  searchParams: { inviter: string };
}

const InviteCodePage = async ({
  params,
  searchParams,
}: InviteCodePageProps) => {
  const profile = await getCurrentUser();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  console.log("yes");
  const inviterProfile = await db.profile.findUnique({
    where: {
      userId: searchParams.inviter,
    },
  });

  console.log(inviterProfile);

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
    include: {
      members: true,
    },
    // data: {
    //   members: {
    //     create: [
    //       {
    //         profileId: profile.id,
    //       },
    //     ],
    //   },
    // },
  });

  // if (server) {
  //   return redirect(`/servers/${server.id}`);
  // }

  if (server) {
    return (
      <ConfirmJoinServerModal
        server={server}
        inviter={inviterProfile!.name}
        currentUserId={profile.id}
      />
    );
  }

  return null;
};

export default InviteCodePage;
