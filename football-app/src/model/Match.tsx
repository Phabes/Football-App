import { Club } from "./Club";

export interface Match {
  id?: number;
  homeTeam: Club;
  awayTeam?: Club;
  score: Array<number>;
}
