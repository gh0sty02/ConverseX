import { redirectToSignIn } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";
import { Metadata } from "next";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/current-profile";
import { ConfirmJoinServerModal } from "@/components/modals/confirm-join-server-modal";
import { InvalidInviteModal } from "@/components/modals/invalid-invite-modal";

export const metadata: Metadata = {
  title: "ConverseX | Join Server",
  description: "Join Server Using Invite Link",
};

interface InviteCodePageProps {
  params: {
    inviteCode: string;
  };
  searchParams: { inviter: string };
}

const InviteCodePage = async ({
  params: { inviteCode },
  searchParams,
}: InviteCodePageProps) => {
  const profile = await getCurrentUser();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!inviteCode) {
    return redirect("/");
  }

  const userInInvitedServer = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (userInInvitedServer) {
    return redirect(`/servers/${userInInvitedServer.id}`);
  }

  // get the inviter name
  const inviterName = await db.profile.findUnique({
    where: {
      userId: searchParams.inviter,
    },
    select: {
      name: true,
    },
  });

  // get the invited server
  const server = await db.server.findFirst({
    where: {
      inviteCode: inviteCode,
    },
    include: {
      members: true,
    },
  });

  if (server && inviterName) {
    return (
      <ConfirmJoinServerModal
        server={server}
        inviter={inviterName.name}
        currentUserId={profile.id}
      />
    );
  }

  return <InvalidInviteModal />;
};

export default InviteCodePage;
