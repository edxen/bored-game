import config from "../config";
import generateTiles from "../utils/generateTiles";

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

export type TDice = {
    display: number;
    current: number;
    done: boolean;
    move: boolean;
};

/**
 * Data to initialize Dice state
**/
export const initialDiceState: TDice = {
    display: 0,
    current: 1,
    done: true,
    move: false,
};

export type TTile = {
    type: 'plain' | 'portal' | 'dice' | 'flag' | 'safe' | 'stop' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up-left' | 'arrow-up-right' | 'arrow-down-left' | 'arrow-down-right';
    occupants: string[];
    edge: boolean;
    path: number;
    index: number;
};

export type TilePayload<K extends keyof TTile> = {
    index: number;
    key: K;
    value: TTile[K];
};

export const initialTileState = generateTiles({ ...config.tiles.size });

export type TPlayer = {
    id: string;
    type: 'human' | 'computer';
    name: string;
    path: number;
    color: string;
    index?: number;
    last_path?: number;
    roll?: number;
};

export const initialPlayerState: TPlayer[] = config.customPlayer.enabled ? config.customPlayer.state : [];