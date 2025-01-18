import { MangoBoard } from "@utils/types";

const size = 6;

export const createEmptyBoard = (): MangoBoard => ({
  board: Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({
      hasBanana: false,
      hasMango: false,
      hasRight: { exists: false, isEquals: false },
      hasBottom: { exists: false, isEquals: false },
      isFixed: false,
    }))
  )
});

