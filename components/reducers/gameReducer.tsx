import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { initialGameState, TGame, TPlayer } from "./initialStates";

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        /**
         * Toggle boolean game state.
         * @param started - set game started status
         * @param over - set game over status 
        **/
        toggleGame: (state: TGame, action: PayloadAction<Partial<{ started: boolean, over: boolean; }>>) => {
            const { ...updates } = action.payload;
            return produce(state, draftState => Object.assign(draftState, updates));
        },
        /**
         * Updates round data.
         * Following actions occur: 
         * When turn is a multiple of queue length, round counter is incremented by 1. 
         * Turn count is incremented by 1.
         * Queue is rotated by moving first player in queue to last.
         *  
        **/
        updateRoundCounter: (state) => {
            return produce(state, draftState => {
                const { round } = draftState;
                const { turn, queue } = draftState.round;

                const incrementTurn = () => round.turn++;
                const incrementRound = () => (turn % queue.length === 0) && round.count++;
                const rotateQueue = () => round.queue = [...queue.slice(1), queue[0]];

                incrementRound();
                incrementTurn();
                rotateQueue();
            });
        },
        /**
         * Update player in queue with ID based on provided string array.
         * @param arg1 - Accepts: string array with id as property
        **/
        updateQueuePlayers: (state, action: PayloadAction<TPlayer[]>) => {
            const players = action.payload;
            return produce(state, draftState => {
                draftState.round.queue = players.map(player => player.id);
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

export const { toggleGame, updateRoundCounter, updateQueuePlayers, updateGame } = gameSlice.actions;
export default gameSlice.reducer;
