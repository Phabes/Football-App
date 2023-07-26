import "./Map2D.css";
import io from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import config from "../../config/Config";
import { Match } from "../../model/Match";
import { useResize } from "../../hooks/useResize";
import { Ball } from "../../model/Ball";

const Map2D = (): JSX.Element => {
  const [ball, setBall] = useState<Ball>();
  const [match, setMatch] = useState<Match>();
  const ref = useRef<HTMLDivElement>(null);
  const { width, height } = useResize(ref);
  const [homeTeam, setHomeTeam] = useState<any>([]);
  const [awayTeam, setAwayTeam] = useState<any>([]);

  useEffect(() => {
    if (width != 0 && height != 0 && match) {
      const homeTeam = [];
      const xSpace = width / match.homeTeam.formation.length;
      let total = 0;
      let currX = 0;
      for (let line of match.homeTeam.formation) {
        const ySpace = height / line;
        for (let i = 0; i < line; i++) {
          homeTeam.push(
            <div
              style={{
                position: "absolute",
                top: i * ySpace + ySpace / 2 + "px",
                left: currX + xSpace / 2 + "px",
              }}
            >
              {total}
              {ball?.currentTeam == "homeTeam" && ball.currentPlayer == total
                ? "+"
                : ""}
              {ball?.lastTeam == "homeTeam" && ball.lastPlayer == total
                ? "-"
                : ""}
            </div>
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
            awayTeam.push(
              <div
                style={{
                  position: "absolute",
                  top: i * ySpace + ySpace / 2 + "px",
                  right: currX + xSpace / 2 + "px",
                }}
              >
                {total}
                {ball?.currentTeam == "awayTeam" && ball.currentPlayer == total
                  ? "+"
                  : ""}
                {ball?.lastTeam == "awayTeam" && ball.lastPlayer == total
                  ? "-"
                  : ""}
              </div>
            );
            total++;
          }
          currX += xSpace;
        }
        setAwayTeam(awayTeam);
      }
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
        </div>
        <div>{JSON.stringify(ball)}</div>
      </div>
    </div>
  );
};

export default Map2D;
