import config from "../config";
import generateTiles from "../utils/generateTiles";

export type TRound = {
    queue: string[];
    turn: number;
    count: number;
    phase: 'unstarted' | 'pre' | 'roll' | 'action' | 'extra' | 'post';
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
    display: string;
    current: number;
    force: number;
};

/**
 * Data to initialize Dice state
**/
export const initialDiceState: TDice = {
    display: '',
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

/**
 * Data to initialize Player state
**/


type TPlayerExtra = {
    low?: boolean;
    high?: boolean;
    exact?: boolean;
    extra?: boolean;
    back?: boolean;
    dodge?: boolean;
};

export const playerExtra = {
    exact: 'Exact Roll',
    low: 'Low Roll',
    high: 'High Roll',
    extra: 'Extra Roll',
    back: 'Roll Back',
    dodge: 'Dodge'
};

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
    extra?: TPlayerExtra;
};

export const initialPlayerState: TPlayer[] = config.customPlayer?.enabled ? config.customPlayer.state : [];