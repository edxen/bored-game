import { TGame } from "./gameReducer";

/**
 * Data to initialize Game state
**/
export const initialGameState: TGame = {
    started: false,
    over: false,
    round: {
        queue: [],
        turn: 0,
        count: 0
    },
    ranking: {
        list: []
    }
};