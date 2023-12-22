import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";
import { initialGameState } from "./initialStates";

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

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        /**
         * Toggle boolean game state.
         * @param target - Object to update. Accepted values: 'started', 'over'
         * @param flag - Value to provide to target. Accepted values: 'true', 'false 
        **/
        toggleGame: (state: TGame, action: PayloadAction<{ target: 'started' | 'over', flag: boolean; }>) => {
            const { target, flag } = action.payload;
            return produce(state, draftState => {
                draftState[target] = flag;
            });
        },
        /**
         * Increments round counter by 1 .
        **/
        updateRound: (state) => {
            return produce(state, draftState => {
                draftState.round.count++;
            });
        },
        /**
         * updates round turn related data.
         * @param target - Accepted values: 'next', 'counter'
         * 
         * @param description - target: 'next' - moves first player in queue to last'
         * @param description - target: 'counter' - increments turn counter by 1
        **/
        updateTurn: (state, action: PayloadAction<{ target: 'next' | 'counter'; }>) => {
            const { target } = action.payload;
            return produce(state, draftState => {
                switch (target) {
                    case 'next':
                        const [first, ...rest] = draftState.round.queue;
                        draftState.round.queue = [...rest, first];
                        break;

                    case 'counter':
                        draftState.round.turn++;
                        break;
                }
            });
        },
        /**
         * Toggle boolean game state.
         * @param target - Update selected target array string. Accepted values: 'nextTurn','queue', 'ranking'
         * @param value - Value to overwrite selected target data. Accepts string array value.
        **/
        updateGame: (state, action: PayloadAction<{ target: 'queue' | 'ranking', value: string[]; }>) => {
            const { target, value } = action.payload;
            return produce(state, draftState => {
                switch (target) {
                    case 'queue':
                        draftState.round.queue = value;
                        break;
                    case 'ranking':
                        draftState.ranking.list = [...value, ...draftState.ranking.list];
                        break;
                }
            });
        }
    }
});

export const { toggleGame, updateRound, updateTurn, updateGame } = gameSlice.actions;
export default gameSlice.reducer;
