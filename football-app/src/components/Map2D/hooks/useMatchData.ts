import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Match } from "../../../model/Match";
import { Action } from "../../../model/Action";
import config from "../../../config/Config";
import { getMatchData } from "../../../utils/getMatchData";
import { getSpecificAction } from "../../../utils/getSpecificAction";

export const useMatchData = () => {
  const [socketID, setSocketID] = useState<string>("");
  const [match, setMatch] = useState<Match>();
  const [totalNumberOfActions, setTotalNumberOfActions] = useState<number>(0);
  const [queue, setQueue] = useState<Action[]>([]);
  const [action, setAction] = useState<number>(-1);

  const getAction = async (value: number) => {
    const data = await getSpecificAction(socketID, value);
    setAction(0);
    setQueue([data]);
  };

  useEffect(() => {
    const socket = io(config.url);
    socket.connect();
    const params = window.location.pathname.split("/");

    const matchID = params[params.length - 1];
    const matchData = getMatchData(matchID);
    matchData
      .then((match: Match) => {
        setMatch(match);
      })
      .catch((error: any) => console.log(error));

    const handleConnect = () => {
      console.log(`Connected ${socket.id}`);
      setSocketID(socket.id);
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

  return { match, queue, totalNumberOfActions, action, setAction, getAction };
};
