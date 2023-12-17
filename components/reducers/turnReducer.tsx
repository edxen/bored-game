import { createSlice } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

const initialState: TPlayer[] = [];

const turnsSlice = createSlice({
    name: 'turns',
    initialState,
    reducers: {
        setTurn: (state, action) => {
            return [...action.payload];
        },
        nextTurn: (state) => {
            const [first, ...rest] = state;
            return [...rest, first];
        }
    }
});

export const { setTurn, nextTurn } = turnsSlice.actions;
export default turnsSlice.reducer;
