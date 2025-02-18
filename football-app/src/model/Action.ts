export interface Action {
  index: number;
  currentTeam: string;
  currentPlayer: number;
  lastTeam: string;
  lastPlayer: number;
  speed: number;
  score: Array<number>;
}
