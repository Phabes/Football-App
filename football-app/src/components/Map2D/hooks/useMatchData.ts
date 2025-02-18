import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { MatchDetails } from "../../../model/MatchDetails";
import { Action } from "../../../model/Action";
import config from "../../../config/Config";
import { getMatchData } from "../../../utils/getMatchData";

export const useMatchData = () => {
  const [match, setMatch] = useState<MatchDetails>();
  const [totalNumberOfActions, setTotalNumberOfActions] = useState<number>(-1);
  const [queue, setQueue] = useState<Action[]>([]);

  useEffect(() => {
    const socket = io(config.url);
    socket.connect();
    const params = window.location.pathname.split("/");

    const matchID = params[params.length - 1];
    const matchData = getMatchData(matchID);
    matchData
      .then((match: MatchDetails) => {
        setMatch(match);
      })
      .catch((error: any) => console.log(error));

    const handleConnect = () => {
      console.log(`Connected ${socket.id}`);
      socket.emit(`matches`, {
        matchID: params[params.length - 1],
      });
    };

    const handleMatchesData = (data: {
      totalNumberOfActions: number;
      action: Action;
    }) => {
      setQueue((prev) => [...prev, data.action]);
      setTotalNumberOfActions(data.totalNumberOfActions);
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

  return { match, queue, totalNumberOfActions };
};
