import get from "lodash/get";
import head from "lodash/head";
import { useCallback, useEffect, useRef } from "react";

function useInfiniteScroll(props) {
  const {
    loading,
    next,
    callData,
    paginationType,
    hasInfiniteScrollError,
    setHasInfiniteScrollError,
    autoScroll,
  } = props;

  const observer = useRef();
  const nextCountRef = useRef(0);
  const newNextRef = useRef();

  useEffect(() => {
    if (newNextRef?.current && newNextRef?.current !== next) {
      nextCountRef.current = 0;
    }
  }, [next]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading || autoScroll) return;
      if (observer?.current) observer?.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const entry = head(entries);
        const isIntersecting = get(entry, "isIntersecting", false);

        if (
          isIntersecting &&
          next &&
          // paginationType === ENUMS.paginationType.scroll.value &&
          !hasInfiniteScrollError
        ) {
          nextCountRef.current = nextCountRef?.current + 1;
          if (nextCountRef?.current < 2) {
            newNextRef.current = next;
            callData(next, true);
          }
        } else if (hasInfiniteScrollError && !isIntersecting) {
          if (setHasInfiniteScrollError) setHasInfiniteScrollError(false);
        }
      });

      if (node) observer?.current.observe(node);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [next, callData, autoScroll]
  );

  return [lastElementRef];
}

export default useInfiniteScroll;
