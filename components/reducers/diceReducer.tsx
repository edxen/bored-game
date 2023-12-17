import { createSlice } from "@reduxjs/toolkit";
import { TPlayer } from "./playersReducer";

export type TDice = {
    display: number;
    current: number;
    done: boolean;
    turn: TPlayer['type'];
    id: string;
    move: boolean;
};

const initialState: TDice = {
    display: 0, current: 1, done: true, turn: 'human', id: '', move: false
};

const diceSlice = createSlice({
    name: 'dice',
    initialState,
    reducers: {
        setDice: (state, action) => {
            const { display, current, done, turn, id, move }: Partial<TDice> = action.payload;

            if (display !== undefined) state.display = display;
            if (current !== undefined) state.current = current;
            if (done !== undefined) state.done = done;
            if (move !== undefined) state.move = move;
        }
    }
});

export const { setDice } = diceSlice.actions;
export default diceSlice.reducer;
