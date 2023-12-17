import { createSlice } from "@reduxjs/toolkit";
import { TPlayer } from "../interface";

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
        setDisplay: (state, action) => {
            state.display = action.payload;
        },
        setCurrent: (state, action) => {
            state.current = action.payload;
        },
        setDone: (state, action) => {
            state.done = action.payload;
        },
        setTurn: (state, action) => {
            state.turn = action.payload;
        }
    }
});

export const { setDisplay, setCurrent, setDone, setTurn } = diceSlice.actions;
export default diceSlice.reducer;
