import "./Map2D.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import config from "../../config/Config";
import { Match } from "../../model/Match";
import { useResize } from "../../hooks/useResize";
import { Action } from "../../model/Action";
import { Line } from "../../model/Line";
import Player2D from "../Player2D/Player2D";
import PitchLines2D from "../PitchLines2D/PitchLines2D";
import PassLine2D from "../PassLine2D/PassLine2D";
import Ball2D from "../Ball2D/Ball2D";

const Map2D = (): JSX.Element => {
  const [match, setMatch] = useState<Match>();
  const [queue, setQueue] = useState<Action[]>([]);
  const [action, setAction] = useState<number>(-1);
  const [tick, setTick] = useState<number>(0);
  const [inPlay, setInPlay] = useState<boolean>(false);
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
  const ref = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const { width, ballSize, handleResize /*, height*/ } = useResize(
    ref,
    ballRef
  );
  const height =
    (width * config.halfPitchSize.height) / config.halfPitchSize.width;
  const scale =
    width > config.startScalingSize ? 1 : width / config.startScalingSize;
  const xStep =
    ((line.end.left - line.start.left) /
      (action != -1 ? queue[action].speed : config.speed)) *
    config.timeStep;
  const yStep =
    ((line.end.top - line.start.top) /
      (action != -1 ? queue[action].speed : config.speed)) *
    config.timeStep;
  const started = action >= 0;

  useEffect(() => {
    if (height > 0 && match) {
      const homeTeam = [];
      const xSpace = width / match.homeTeam.formation.length;
      let total = 0;
      let currX = 0;
      let newLine: Line = {
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
          const top =
            i * ySpace + ySpace / 2 - (config.player2dSize / 2) * scale;
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
      if (match.awayTeam) {
        const awayTeam = [];
        currX = 0;
        total = 0;
        for (let line of match.awayTeam.formation) {
          const ySpace = height / line;
          for (let i = 0; i < line; i++) {
            const top =
              i * ySpace + ySpace / 2 - (config.player2dSize / 2) * scale;
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
      }
      newLine.start.left += (config.player2dSize / 2) * scale;
      newLine.start.top += (config.player2dSize / 2) * scale;
      newLine.end.left += (config.player2dSize / 2) * scale;
      newLine.end.top += (config.player2dSize / 2) * scale;
      setLine(newLine);
    }
  }, [width, match, action]);

  useEffect(() => {
    if (
      (action != -1 ? queue[action].speed : config.speed) -
        config.timeStep * tick <=
      0
    )
      setInPlay(false);
  }, [tick]);

  useEffect(() => {
    let remaining =
      (action != -1 ? queue[action].speed : config.speed) -
      config.timeStep * tick;
    const interval = setInterval(() => {
      remaining -= config.timeStep;
      if (remaining <= 0) clearInterval(interval);
      setTick((prev) => prev + 1);
    }, config.timeStep);
    return () => clearInterval(interval);
  }, [line]);

  useEffect(() => {
    if (!inPlay) {
      const interval = setInterval(() => {
        if (action < queue.length - 1 && !inPlay) {
          setAction((prev) => prev + 1);
          clearInterval(interval);
        } else if (inPlay) clearInterval(interval);
      }, config.refreshTime);
      return () => clearInterval(interval);
    }
  }, [inPlay]);

  useEffect(() => {
    handleResize();
    setTick(0);
    if (started && !inPlay) setInPlay(true);
  }, [action]);

  useEffect(() => {
    if (!inPlay && action < queue.length - 1) setAction((prev) => prev + 1);
  }, [queue]);

  useEffect(() => {
    const socket = io(config.url);
    socket.connect();
    const params = window.location.pathname.split("/");

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchID: params[params.length - 1] }),
    };
    fetch(config.url + "match", requestOptions)
      .then((response) => response.json())
      .then((match: Match) => {
        setMatch(match);
      })
      .catch((error: any) => console.log(error));

    const handleConnect = () => {
      console.log(`Connected ${socket.id}`);
      socket.emit(`matches`, {
        matchID: params[params.length - 1],
      });
    };

    const handleMatchesData = (data: { matchData: Action }) => {
      setQueue((prev) => [...prev, data.matchData]);
    };

    const handleDisconnect = () => {
      console.log("Disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on(`matches/${params[params.length - 1]}`, handleMatchesData);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off(`matches/${params[params.length - 1]}`, handleMatchesData);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="map2D">
      <div className="mapContent">
        <div className="matchLabel">
          <div className="matchFirstClubName">{match?.homeTeam.name}</div>
          <div className="versus">VS</div>
          <div className="matchSecondClubName">{match?.awayTeam?.name}</div>
        </div>
        <div id="matchStream" style={{ height: height }}>
          <div ref={ref} id="homeTeam" className="halfField">
            {homeTeam}
          </div>
          <div id="awayTeam" className="halfField">
            {awayTeam}
          </div>
          {height > 0 && <PitchLines2D width={width} height={height} />}
          {started && <PassLine2D line={line} />}
          {started && (
            <Ball2D
              ballRef={ballRef}
              posistion={{
                top: line.start.top + yStep * tick - ballSize / 2,
                left: line.start.left + xStep * tick - ballSize / 2,
              }}
            />
          )}
        </div>
        <div>{JSON.stringify(queue[action])}</div>
      </div>
    </div>
  );
};

export default Map2D;
