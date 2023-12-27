import config from '../configuration';
import generateTiles from "../utils/generateTiles";

export type TRound = {
    queue: string[];
    turn: number;
    count: number;
    phase: 'unstarted' | 'pre' | 'roll' | 'action' | 'xaction' | 'extra' | 'post' | 'end' | 'over';
};

// unstarted is start of game, initial set
// pre is before the turn start, mostly to kickstart AI turn
// roll either switched dynamically in pre with AI or by human when clicking roll dice button
// action is for moving regards dice result, checking occupied tile effect 
// eliminating initial occupant, checking if has portal effect, checking if dice 
// if player has extra action, player will be displayed extra menu, if not will proceed

type TRanking = {
    list: string[];
};

export type TGame = {
    initialize: boolean;
    started: boolean;
    over: boolean;
    round: TRound;
    ranking: TRanking;
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
    }
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


export type TPlayerAction = {
    low?: boolean;
    high?: boolean;
    exact?: boolean;
    extra?: boolean;
};

export const playerAction = {
    exact: 'Exact Roll',
    low: 'Low Roll',
    high: 'High Roll',
    extra: 'Extra Roll',
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
    action: TPlayerAction;
    extra?: boolean;
};

export const initialPlayerState: TPlayer[] = config.customPlayer?.enabled ? config.customPlayer.state : [];