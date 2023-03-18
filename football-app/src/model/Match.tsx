import { Club } from "./Club";

export interface Match {
  id?: number;
  firstTeam: Club;
  secondTeam?: Club;
}
