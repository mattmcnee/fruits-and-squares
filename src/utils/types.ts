export type MangoBoard = {
  hasBanana: boolean;
  hasMango: boolean;
  hasRight: { exists: boolean; isEquals: boolean; };
  hasBottom: { exists: boolean; isEquals: boolean; };
  isFixed: boolean;
}[][];

export type MangoDoc = {
  board: MangoBoard;
  players: string[];
  createdAt: Date;
  index: number;
  ref?: string;
  isNew?: boolean;
}

export type MangoKey = "hasBanana" | "hasMango";

export type GameState = {
  timer: number;
  playing: boolean;
  completed: boolean;
}

