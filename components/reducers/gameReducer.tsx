import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { initialGameState, TGame, TRound } from "./initialStates";

const gameSlice = createSlice({
    name: 'game',
    initialState: initialGameState,
    reducers: {
        /**
         * Toggle boolean game state.
         * @param initialize - set game initialize status
         * @param started - set game started status
         * @param over - set game over status 
        **/
        toggleGame: (state: TGame, action: PayloadAction<Partial<{ initialize: boolean, started: boolean, over: boolean; }>>) => {
            const { ...updates } = action.payload;
            return produce(state, draftState => Object.assign(draftState, updates));
        },
        /**
         * Updates phase data to process turn.
         * @param phase - Accepts: 'pre' | 'roll' | 'action' | 'post'
         *  
        **/
        updatePhase: (state, action: PayloadAction<{ phase: TRound['phase']; }>) => {
            return produce(state, draftState => {
                draftState.round.phase = action.payload.phase;
            });
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
        updateQueuePlayers: (state, action: PayloadAction<string[]>) => {
            return produce(state, draftState => {
                draftState.round.queue = action.payload;
            });
        },
        /**
         * Toggle boolean game state.
         * @param target - Update selected target array string. Accepted values: 'queue', 'ranking', 'history', 'flags
         * @param value - Value to overwrite selected target data. Accepts string array value.
        **/
        updateGame: (state, action: PayloadAction<{ target: 'queue' | 'ranking' | 'history' | 'flags', value: string[]; }>) => {
            const { target, value } = action.payload;
            return produce(state, draftState => {
                switch (target) {
                    case 'queue':
                        draftState.round.queue = value;
                        break;
                    case 'ranking':
                        draftState.ranking = [...value, ...draftState.ranking];
                        break;
                    case 'history':
                        draftState.history = [...value, ...draftState.history];
                        break;
                    case 'flags':
                        draftState.flags = [...value, ...draftState.flags];
                        break;
                }
            });
        }
    }
});

export const { toggleGame, updateRoundCounter, updatePhase, updateQueuePlayers, updateGame } = gameSlice.actions;
export default gameSlice.reducer;
