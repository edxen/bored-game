import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { initialGameState, TGame } from "./initialStates";

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        /**
         * Toggle boolean game state.
         * @param started - set game started status
         * @param over - set game over status 
        **/
        toggleGame: (state: TGame, action) => {
            const { ...updates }: { [key: string]: boolean; } = action.payload;
            return produce(state, draftState => Object.assign(draftState, updates));
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
