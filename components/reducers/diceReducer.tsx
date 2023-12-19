import { createSlice } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

export type TDice = {
    display: number;
    current: number;
    done: boolean;
    move: boolean;
    started: boolean;
};

const initialState: TDice = {
    display: 0, current: 1, done: true, move: false, started: false
};

const diceSlice = createSlice({
    name: 'dice',
    initialState,
    reducers: {
        setDice: (state, action) => {
            const { display, current, done, started, move }: Partial<TDice> = action.payload;

            if (display !== undefined) state.display = display;
            if (current !== undefined) state.current = current;
            if (done !== undefined) state.done = done;
            if (move !== undefined) state.move = move;
            if (started !== undefined) state.started = started;
        }
    }
});

export const { setDice } = diceSlice.actions;
export default diceSlice.reducer;
