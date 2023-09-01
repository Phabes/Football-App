import { RefObject, useEffect, useState } from "react";

export const useResize = (
  pitchRef: RefObject<HTMLDivElement | null>,
  ballRef: RefObject<HTMLDivElement | null>
) => {
  const [width, setWidth] = useState(0);
  const [ballSize, setBallSize] = useState(0);
  // const [height, setHeight] = useState(0);

  const handleResize = () => {
    if (pitchRef.current) {
      setWidth(pitchRef.current.clientWidth);
      // setHeight(myRef.current.clientHeight);
    }
    if (ballRef.current) setBallSize(ballRef.current.clientWidth);
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

  return { width, ballSize, handleResize };
  // return { width, height };
};
