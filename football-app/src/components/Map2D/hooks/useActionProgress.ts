import { useEffect, useState } from "react";
import { Action } from "../../../model/Action";
import config from "../../../config/Config";
import { Line } from "../../../model/Line";

export const useActionProgress = (
  queue: Action[],
  action: number,
  setAction: React.Dispatch<React.SetStateAction<number>>,
  line: Line,
  handleResize: () => void
) => {
  const [tick, setTick] = useState<number>(0);
  const [inPlay, setInPlay] = useState<boolean>(false);
  const started = action >= 0;

  useEffect(() => {
    const actionSpeed = action != -1 ? queue[action].speed : config.speed;
    let remainingPassTime = actionSpeed - config.timeStep * tick;

    const interval = setInterval(() => {
      remainingPassTime -= config.timeStep;
      const passFinished = remainingPassTime <= 0;

      if (passFinished) {
        clearInterval(interval);
        setInPlay(false);
      }

      setTick((prev) => prev + 1);
    }, config.timeStep);

    return () => clearInterval(interval);
  }, [line]);

  useEffect(() => {
    if (inPlay) {
      return;
    }

    const interval = setInterval(() => {
      if (action < queue.length - 1 && !inPlay) {
        setAction((prev) => prev + 1);
        clearInterval(interval);
      } else if (inPlay) {
        clearInterval(interval);
      }
    }, config.refreshTime);

    return () => clearInterval(interval);
  }, [inPlay]);

  useEffect(() => {
    handleResize();
    setTick(0);

    if (!started || inPlay) {
      return;
    }

    setInPlay(true);
  }, [action]);

  useEffect(() => {
    if (inPlay || action >= queue.length - 1) {
      return;
    }

    setAction((prev) => prev + 1);
  }, [queue]);

  return { tick, started };
};
