import { Action } from "../../../model/Action";
import { Line } from "../../../model/Line";
import config from "../../../config/Config";

export const getCalculations = (
  line: Line,
  queue: Action[],
  action: number
) => {
  const xStep =
    ((line.end.left - line.start.left) /
      (action != -1 ? queue[action].speed : config.speed)) *
    config.timeStep;
  const yStep =
    ((line.end.top - line.start.top) /
      (action != -1 ? queue[action].speed : config.speed)) *
    config.timeStep;

  return { xStep, yStep };
};
