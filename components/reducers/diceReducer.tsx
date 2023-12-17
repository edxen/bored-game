import { createSlice } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

export type TDice = {
    display: number;
    current: number;
    done: boolean;
    turn: TPlayer['type'];
};

const initialState: TDice = {
    display: 0, current: 1, done: true, turn: 'human'
};

const diceSlice = createSlice({
    name: 'dice',
    initialState,
    reducers: {
        setDice: (state, action) => {
            const { display, current, done, turn }: Partial<TDice> = action.payload;

            if (display !== undefined) state.display = display;
            if (current !== undefined) state.current = current;
            if (done !== undefined) state.done = done;
            if (turn !== undefined) state.turn = turn;
        }
    }
});

export const { setDice } = diceSlice.actions;
export default diceSlice.reducer;
