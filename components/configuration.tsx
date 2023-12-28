import { TPlayer } from "./reducers/initialStates";

type TConfig = {
    enableSpecificDice: boolean,
    customPlayer: {
        enabled: boolean,
        state: TPlayer[];
    },
    delay: number,
    moveSpeed: number,
    rollSpeed: number,
    diceInterval: number,
    actionInterval: number,
    tiles: {
        gridColumns: string,
        size: {
            columns: number,
            rows: number;
        };
    };
};

let config: TConfig = {
    enableSpecificDice: true,
    customPlayer: {
        enabled: false,
        state: []
    },
    delay: 0,
    moveSpeed: 0,
    rollSpeed: 0,
    diceInterval: 0,
    actionInterval: 0,
    tiles: {
        gridColumns: 'grid-cols-11',
        size: {
            columns: 11,
            rows: 11
        }
    }
};

export default config;