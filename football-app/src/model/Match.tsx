import { Club } from "./Club";

export interface Match {
  matchID: number;
  firstTeam: Club;
  secondTeam: Club | null;
}
