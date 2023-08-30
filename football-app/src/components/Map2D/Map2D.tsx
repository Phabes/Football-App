import "./Map2D.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import config from "../../config/Config";
import { Match } from "../../model/Match";
import { useResize } from "../../hooks/useResize";
import { Ball } from "../../model/Ball";
import { Line } from "../../model/Line";
import Player2D from "../Player2D/Player2D";

const Map2D = (): JSX.Element => {
  const [ball, setBall] = useState<Ball>();
  const [match, setMatch] = useState<Match>();
  const [line, setLine] = useState<Line>();
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResize(ref);
  const [homeTeam, setHomeTeam] = useState<JSX.Element[]>([]);
  const [awayTeam, setAwayTeam] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (width != 0 && height != 0 && match) {
      const homeTeam = [];
      const xSpace = width / match.homeTeam.formation.length;
      let total = 0;
      let currX = 0;
      let newLine: Line = {
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
      };
      for (let line of match.homeTeam.formation) {
        const ySpace = height / line;
        for (let i = 0; i < line; i++) {
          const top = i * ySpace + ySpace / 2 - config.player2dSize / 2;
          const left = currX + xSpace / 2 - config.player2dSize / 2;
          const hasBall =
            ball?.currentTeam == "homeTeam" && ball.currentPlayer == total;
          let sign = "";
          if (ball?.lastTeam == "homeTeam" && ball.lastPlayer == total) {
            newLine.x1 = left;
            newLine.y1 = top;
            sign = "-";
          }
          if (ball?.currentTeam == "homeTeam" && ball.currentPlayer == total) {
            newLine.x2 = left;
            newLine.y2 = top;
            sign = "+";
          }
          homeTeam.push(
            <Player2D
              left={left}
              top={top}
              total={total}
              hasBall={hasBall}
              colors={match.homeTeam.colors}
            ></Player2D>
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
            const top = i * ySpace + ySpace / 2 - config.player2dSize / 2;
            const left = width - (currX + xSpace / 2) - config.player2dSize / 2;
            const hasBall =
              ball?.currentTeam == "awayTeam" && ball.currentPlayer == total;
            let sign = "";
            if (ball?.lastTeam == "awayTeam" && ball.lastPlayer == total) {
              newLine.x1 = width + left;
              newLine.y1 = top;
              sign = "-";
            }
            if (
              ball?.currentTeam == "awayTeam" &&
              ball.currentPlayer == total
            ) {
              newLine.x2 = width + left;
              newLine.y2 = top;
              sign = "+";
            }
            awayTeam.push(
              <Player2D
                left={left}
                top={top}
                total={total}
                hasBall={hasBall}
                colors={match.awayTeam.colors}
              ></Player2D>
            );
            total++;
          }
          currX += xSpace;
        }
        setAwayTeam(awayTeam);
      }
      setLine(newLine);
    }
  }, [width, height, match, ball]);

  useEffect(() => {
    const socket = io("localhost:5000");
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

    const handleMatchesData = (data: any) => {
      setBall(data.matchData);
      console.log(data);
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
        <div id="matchStream">
          <div ref={ref} id="homeTeam" className="halfField">
            {homeTeam}
          </div>
          <div id="awayTeam" className="halfField">
            {awayTeam}
          </div>
          <svg>
            <line
              x1={line?.x1}
              y1={line?.y1}
              x2={line?.x2}
              y2={line?.y2}
              stroke="black"
            ></line>
          </svg>
        </div>
        <div>{JSON.stringify(ball)}</div>
      </div>
    </div>
  );
};

export default Map2D;
