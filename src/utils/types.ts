export interface MangoBoard {
  board: {
    hasBanana: boolean;
    hasMango: boolean;
    hasRight: { exists: boolean; isEquals: boolean; };
    hasBottom: { exists: boolean; isEquals: boolean; };
    isFixed: boolean;
  }[][];
}