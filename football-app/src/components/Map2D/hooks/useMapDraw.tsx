import { useEffect, useState } from "react";
import { Line } from "../../../model/Line";
import { Match } from "../../../model/Match";
import { Action } from "../../../model/Action";
import Player2D from "../../Player2D/Player2D";
import config from "../../../config/Config";

export const useMapDraw = (
  match: Match | undefined,
  width: number,
  height: number,
  queue: Action[],
  action: number
) => {
  const [homeTeam, setHomeTeam] = useState<JSX.Element[]>([]);
  const [awayTeam, setAwayTeam] = useState<JSX.Element[]>([]);
  const [line, setLine] = useState<Line>({
    start: {
      left: 0,
      top: 0,
    },
    end: {
      left: 0,
      top: 0,
    },
  });

  const scale =
    width > config.startScalingSize ? 1 : width / config.startScalingSize;

  useEffect(() => {
    if (height <= 0 || !match) {
      return;
    }

    const homeTeam = [];
    const xSpace = width / match.homeTeam.formation.length;
    let total = 0;
    let currX = 0;
    const newLine: Line = {
      start: {
        left: 0,
        top: 0,
      },
      end: {
        left: 0,
        top: 0,
      },
    };

    for (let line of match.homeTeam.formation) {
      const ySpace = height / line;
      for (let i = 0; i < line; i++) {
        const top = i * ySpace + ySpace / 2 - (config.player2dSize / 2) * scale;
        const left = currX + xSpace / 2 - (config.player2dSize / 2) * scale;
        if (
          action >= 0 &&
          queue[action].lastTeam == "homeTeam" &&
          queue[action].lastPlayer == total
        ) {
          newLine.start.left = left;
          newLine.start.top = top;
        }
        if (
          action >= 0 &&
          queue[action].currentTeam == "homeTeam" &&
          queue[action].currentPlayer == total
        ) {
          newLine.end.left = left;
          newLine.end.top = top;
        }
        homeTeam.push(
          <Player2D
            key={`home${total}`}
            left={left}
            top={top}
            total={total}
            colors={match.homeTeam.colors}
            scale={scale}
          />
        );
        total++;
      }
      currX += xSpace;
    }
    setHomeTeam(homeTeam);

    if (!match.awayTeam) {
      return;
    }

    const awayTeam = [];
    currX = 0;
    total = 0;
    for (let line of match.awayTeam.formation) {
      const ySpace = height / line;
      for (let i = 0; i < line; i++) {
        const top = i * ySpace + ySpace / 2 - (config.player2dSize / 2) * scale;
        const left =
          width - (currX + xSpace / 2) - (config.player2dSize / 2) * scale;
        if (
          action >= 0 &&
          queue[action].lastTeam == "awayTeam" &&
          queue[action].lastPlayer == total
        ) {
          newLine.start.left = width + left;
          newLine.start.top = top;
        }
        if (
          action >= 0 &&
          queue[action].currentTeam == "awayTeam" &&
          queue[action].currentPlayer == total
        ) {
          newLine.end.left = width + left;
          newLine.end.top = top;
        }
        awayTeam.push(
          <Player2D
            key={`away${total}`}
            left={left}
            top={top}
            total={total}
            colors={match.awayTeam.colors}
            scale={scale}
          />
        );
        total++;
      }
      currX += xSpace;
    }
    setAwayTeam(awayTeam);

    newLine.start.left += (config.player2dSize / 2) * scale;
    newLine.start.top += (config.player2dSize / 2) * scale;
    newLine.end.left += (config.player2dSize / 2) * scale;
    newLine.end.top += (config.player2dSize / 2) * scale;
    setLine(newLine);
  }, [width, match, action]);

  return { line, homeTeam, awayTeam };
};
