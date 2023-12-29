import config from '../configuration';
import { TPlayer } from '../logic/createPlayer';
import generateTiles from "../utils/generateTiles";

export type TRound = {
    queue: string[];
    turn: number;
    count: number;
    phase: 'unstarted' | 'pre' | 'change' | 'roll' | 'action' | 'xaction' | 'extra' | 'post' | 'end';
};

type TRanking = {
    list: string[];
};

export type TGame = {
    initialize: boolean;
    started: boolean;
    over: boolean;
    round: TRound;
    ranking: TRanking;
    history: string[];
};

/**
 * Data to initialize Game state
**/

export const initialGameState: TGame = {
    initialize: false,
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
    },
    history: []
};

export type TDice = {
    display: string;
    current: number;
    min: number,
    max: number,
    force: number;
};

/**
 * Data to initialize Dice state
**/

export const initialDiceState: TDice = {
    display: '',
    current: 1,
    min: 1,
    max: 6,
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

export const initialPlayerState: TPlayer[] = config.customPlayer?.enabled ? config.customPlayer.state : [];