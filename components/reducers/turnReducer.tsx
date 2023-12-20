import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

export type TTurnState = {
    players: TPlayer[];
    round: number;
    turn: number;
    ranking: string[];
};

const initialState: TTurnState = {
    players: [],
    round: 1,
    turn: 1,
    ranking: [],
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
                turn: state.turn + 1
            };
        },
        increaseRoundCount: (state) => {
            return {
                ...state,
                round: state.round + 1
            };
        },
        setRanking: (state, action: PayloadAction<string>) => {
            return {
                ...state,
                ranking: [action.payload, ...state.ranking]
            };
        }
    }
});

export const { setTurnPlayers, nextTurn, increaseTurnCount, increaseRoundCount, setRanking } = turnsSlice.actions;
export default turnsSlice.reducer;
