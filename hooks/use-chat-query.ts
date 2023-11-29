import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";
import { createUrl } from "@/lib/utils";

interface ChatQueryProps {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
}

export const useChatQuery = ({
  apiUrl,
  paramKey,
  paramValue,
  queryKey,
}: ChatQueryProps) => {
  const { isConnected } = useSocket();

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = createUrl(
      apiUrl,
      {
        cursor: pageParam,
        [paramKey]: paramValue,
      },
      { skipNull: true }
    );
    const res = await fetch(url);

    return res.json();
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      refetchInterval: isConnected ? false : 1000,
    });

  return { data, fetchNextPage, hasNextPage, isFetchingNextPage, status };
};
