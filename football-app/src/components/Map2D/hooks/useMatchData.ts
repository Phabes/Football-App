import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Match } from "../../../model/Match";
import { Action } from "../../../model/Action";
import config from "../../../config/Config";

export const useMatchData = () => {
  const [match, setMatch] = useState<Match>();
  const [score, setScore] = useState<number[]>([0, 0]);
  const [queue, setQueue] = useState<Action[]>([]);

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
        setScore(match.score);
      })
      .catch((error: any) => console.log(error));

    const handleConnect = () => {
      console.log(`Connected ${socket.id}`);
      socket.emit(`matches`, {
        matchID: params[params.length - 1],
      });
    };

    const handleMatchesData = (data: { action: Action }) => {
      setQueue((prev) => [...prev, data.action]);
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

  return { match, score, queue };
};