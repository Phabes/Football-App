import config from "../config/Config";
import { Action } from "../model/Action";

export const getSpecificAction = async (
  socketID: string,
  actionIndex: number
): Promise<Action> => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ socketID, actionIndex }),
  };

  const response = await fetch(config.url + "user", requestOptions);

  return await response.json();
};
