export type GameBoard = MangoBoard | BeansBoard;

export type MangoBoard = MangoCell[][];
export type BeansBoard = BeansCell[][];

export type MangoCell = {
  hasBanana: boolean;
  hasMango: boolean;
  hasRight: { exists: boolean; isEquals: boolean; };
  hasBottom: { exists: boolean; isEquals: boolean; };
  isFixed: boolean;
}

export type BeansCell = {
  color: string;
  hasCross: boolean;
  hasBean: boolean;
}

export type GameDoc = {
  board: GameBoard;
  players: GameScore[];
  createdAt: Date;
  index: number;
  ref?: string;
  isNew?: boolean;
}

export type MangoDoc = {
  board: MangoBoard;
  players: GameScore[];
  createdAt: Date;
  index: number;
  ref?: string;
  isNew?: boolean;
}

export type GameScore = {
  uid: string;
  time: number;
  playedAt: Date;
}

export type MangoKey = "hasBanana" | "hasMango";

export type GameState = {
  timer: number;
  playing: boolean;
  completed: boolean;
  loading: boolean;
}

