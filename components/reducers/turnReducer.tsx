import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

export type TTurnState = {
    players: TPlayer[];
    rounds: number;
    count: number;
};

const initialState: TTurnState = {
    players: [],
    rounds: 0,
    count: 0,
};

const turnsSlice = createSlice({
    name: 'turns',
    initialState,
    reducers: {
        nextTurn: (state) => {
            const [first, ...rest] = state.players;
            return {
                ...state,
                players: [...rest, first]
            };
        },
        setTurnPlayers: (state, action: PayloadAction<TPlayer[]>) => {
            return {
                ...state,
                players: action.payload
            };
        },
        increaseTurnCount: (state) => {
            return {
                ...state,
                count: state.count + 1
            };
        },
        increaseRoundCount: (state) => {
            return {
                ...state,
                round: state.count + 1
            };
        }
    }
});

export const { setTurnPlayers, nextTurn, increaseTurnCount } = turnsSlice.actions;
export default turnsSlice.reducer;
