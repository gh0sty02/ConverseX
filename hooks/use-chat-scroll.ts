import { useEffect, useState } from "react";

type ChatScrollProps = {
  // chat container
  chatRef: React.RefObject<HTMLDivElement>;
  // last message div
  bottomRef: React.RefObject<HTMLDivElement>;

  shouldLoadMore: boolean;
  // fn to load more messages
  loadMore: () => void;
  // number of messages to fetch
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: ChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  // This useEffect sets up a scroll event listener on the chat container (topDiv).
  // When the user scrolls to the top (scrollTop === 0) and the shouldLoadMore flag is true,
  // it triggers the loadMore function to fetch an additional set of messages (count).
  // The cleanup function removes the event listener when the component is unmounted.
  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [shouldLoadMore, loadMore, chatRef]);

  // This useEffect is responsible for determining whether the chat should auto-scroll.
  // we first check if the chat should auto scroll : this will happen when :
  // 1. on initial load
  // 2. when we are close to the bottom of the chat
  useEffect(() => {
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef.current;

    // Function to check the distance between the bottom of the visible part of the chat and the bottom of the chat.
    // If the distance is greater than 100 pixels, the user has scrolled to the top,
    // and we don't want to scroll to the bottom of the chat automatically.
    const shouldAutoScroll = () => {
      // If it's the initial load and we have a bottom part, mark as initialized and return true.

      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    // If shouldAutoScroll() returns true, set a timeout before scrolling to the bottom.
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
