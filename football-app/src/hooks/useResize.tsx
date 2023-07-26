import { Ref, RefObject, useCallback, useEffect, useState } from "react";

export const useResize = (myRef: RefObject<HTMLDivElement | null>) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const handleResize = () => {
    if (myRef.current) {
      setWidth(myRef.current.clientWidth);
      setHeight(myRef.current.clientHeight);
    }
  };

  useEffect(() => {
    window.addEventListener("load", handleResize);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("load", handleResize);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { width, height };
};
