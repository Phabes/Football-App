import { Dispatch, useCallback } from "react";

export const useLastElement = (
  loading: boolean,
  hasMore: boolean,
  observer: any,
  setPageNumber: Dispatch<React.SetStateAction<number>>
) => {
  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) {
        return;
      }
      if (observer.current) {
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  return { lastElementRef };
};
