type TRound = {
    queue: string[];
    turn: number;
    count: number;
};

type TRanking = {
    list: string[];
};

export type TGame = {
    started: boolean;
    over: boolean;
    round: TRound;
    ranking: TRanking;
};

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