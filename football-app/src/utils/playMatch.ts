import { Match } from "../model/Match";
import config from "../config/Config";

interface CreateMatchMessage {
  success: boolean;
  message: string;
}

export const playMatch = async (match: Match): Promise<CreateMatchMessage> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ match: match }),
  };

  const response = await fetch(config.url + "newMatch", requestOptions);

  return await response.json();
};
