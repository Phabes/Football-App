import { RefObject, useEffect, useState } from "react";
import config from "../config/Config";

export const useResize = (
  pitchRef: RefObject<HTMLDivElement | null>,
  ballRef: RefObject<HTMLDivElement | null>
) => {
  const [width, setWidth] = useState(0);
  const [ballSize, setBallSize] = useState(0);

  const height =
    (width * config.halfPitchSize.height) / config.halfPitchSize.width;

  const handleResize = () => {
    if (!pitchRef.current) {
      return;
    }

    setWidth(pitchRef.current.clientWidth);

    if (!ballRef.current) {
      return;
    }
    setBallSize(ballRef.current.clientWidth);
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

  return { width, height, ballSize, handleResize };
};
