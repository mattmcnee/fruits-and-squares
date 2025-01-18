export type MangoBoard = {
  hasBanana: boolean;
  hasMango: boolean;
  hasRight: { exists: boolean; isEquals: boolean; };
  hasBottom: { exists: boolean; isEquals: boolean; };
  isFixed: boolean;
}[][];

export type MangoKey = "hasBanana" | "hasMango";