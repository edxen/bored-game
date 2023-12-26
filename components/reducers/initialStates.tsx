import config from "../config";
import generateTiles from "../utils/generateTiles";

export type TRound = {
    queue: string[];
    turn: number;
    count: number;
    phase: 'unstarted' | 'pre' | 'roll' | 'action' | 'post';
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
        turn: 1,
        count: 1,
        phase: 'unstarted'
    },
    ranking: {
        list: []
    }
};

export type TDice = {
    display: number;
    current: number;
    force: number;
};

/**
 * Data to initialize Dice state
**/
export const initialDiceState: TDice = {
    display: 0,
    current: 1,
    force: 0
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

/**
 * Data to initialize Tile state
**/
const rows = config.tiles?.size.rows;
const columns = config.tiles?.size.columns;
export const initialTileState = generateTiles({ columns: (columns || 11), rows: (rows || 11) });

export type TPlayer = {
    id: string;
    type: 'human' | 'computer';
    name: string;
    path: number;
    color: string;
    index?: number;
    last_path?: number;
    roll?: number;
    skip?: boolean;
};

/**
 * Data to initialize Player state
**/
export const initialPlayerState: TPlayer[] = config.customPlayer?.enabled ? config.customPlayer.state : [];