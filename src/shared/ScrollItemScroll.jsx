import { useEffect, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";
import { BsStopFill } from "react-icons/bs";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";

const ScrollItemScroll = (props) => {
  const {
    listDataResults,
    count,
    loading,
    callData,
    next,
    autoScroll,
    setAutoScroll,
  } = props;
  const hasNext = Boolean(next);

  const [isVisible, setIsVisible] = useState(false);

  const isMoreDataFetchable = listDataResults?.length !== count && hasNext;

  const setScrollBehavior = () => {
    document.body.style.scrollBehavior = "smooth"; // For Safari
    document.documentElement.style.scrollBehavior = "smooth"; // For Chrome, Firefox, IE and Opera
  };

  const onClickScrollToTop = () => {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  };

  const onClickScrollToBottom = () => {
    if (isMoreDataFetchable) {
      setAutoScroll(true);
    } else {
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
      });
    }
  };

  const scrollToBottom = () => {
    if (isMoreDataFetchable && autoScroll) {
      callData?.(next, true);
      window.scrollTo({
        left: 0,
        top: document.body.scrollHeight,
      });
    } else if (autoScroll) {
      setAutoScroll(false);
    }
  };

  useEffect(() => {
    scrollToBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScroll, listDataResults, next]);

  useEffect(() => {
    setScrollBehavior();
  }, []);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    const timer = setTimeout(() => {
      if (!autoScroll) {
        setIsVisible(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  };

  return (
    <div
      className={`flex flex-row fixed right-0 bottom-0 m-4 mr-2 z-10 print:hidden`}
    >
      <div
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={`flex flex-row w-20 h-16 items-end justify-end`}
      >
        <button
          onClick={onClickScrollToBottom}
          className={`${
            isVisible
              ? "p-2 mr-2 text-sm leading-tight font-medium align-middle border-2 border-grey-300 dark:border-accent bg-secondary transition-width duration-500 origin-top-left"
              : "w-5 h-5 mr-2 font-thin text-xs align-middle rounded-full bg-scrollButtonBg"
          } transition-all duration-300 ease-linear  flex items-center justify-center`}
        >
          {isVisible ? (
            <BiChevronDown className="text-accent" size={22} />
          ) : (
            <FaCaretDown size={18} />
          )}
        </button>
        {autoScroll && (
          <button
            className={`p-2 mr-2 text-sm leading-tight font-medium align-middle border-2 border-grey-300 dark:border-accent bg-secondary transition-width duration-500 origin-top-left`}
            onClick={() => setAutoScroll(false)}
          >
            <BsStopFill className="text-accent" size={22} />
          </button>
        )}
        <button
          onClick={onClickScrollToTop}
          className={`${
            isVisible
              ? " p-2 text-sm leading-tight font-medium align-middle border-2 border-grey-300 dark:border-accent bg-secondary transition-width duration-500 origin-top-left"
              : "w-5 h-5 font-thin text-xs align-middle rounded-full bg-scrollButtonBg"
          } transition-all duration-300 ease-linear  flex items-center justify-center`}
        >
          {isVisible ? (
            <BiChevronUp className="text-accent" size={22} />
          ) : (
            <FaCaretUp size={18} />
          )}
        </button>
      </div>
    </div>
  );
};

export default ScrollItemScroll;
