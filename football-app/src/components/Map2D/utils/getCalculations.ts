import { Action } from "../../../model/Action";
import { Line } from "../../../model/Line";
import config from "../../../config/Config";

export const getCalculations = (
  started: boolean,
  line: Line,
  queue: Action[],
  action: number
) => {
  const xStep =
    ((line.end.left - line.start.left) /
      (started && queue[action] ? queue[action].speed : config.speed)) *
    config.timeStep;
  const yStep =
    ((line.end.top - line.start.top) /
      (started && queue[action] ? queue[action].speed : config.speed)) *
    config.timeStep;

  return { xStep, yStep };
};
