"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import { ActionTooltip } from "@/components/action-tooltip";
import { createUrl } from "@/lib/utils";

export const ChatVideoButton = () => {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End Video Call" : "Start Video Call";

  const onClickHander = () => {
    const url = createUrl(
      pathName || "",
      {
        video: isVideo ? undefined : true,
      },
      { skipNull: true }
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button
        className="hover:opacity-75 transition mr-4"
        onClick={onClickHander}
      >
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400 " />
      </button>
    </ActionTooltip>
  );
};
