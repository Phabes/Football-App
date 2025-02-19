import { Match } from "../model/Match";
import config from "../config/Config";

export const getMatchData = async (matchID: string): Promise<Match> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ matchID }),
  };

  const response = await fetch(config.url + "match", requestOptions);

  return await response.json();
};
