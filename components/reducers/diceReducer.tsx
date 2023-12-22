import { createSlice } from "@reduxjs/toolkit";
import { produce } from "immer";
import { TDice, initialDiceState } from "./initialStates";



const diceSlice = createSlice({
    name: 'dice',
    initialState: initialDiceState,
    reducers: {
        setDice: (state, action) => {
            const { ...updates }: Partial<TDice> = action.payload;
            return produce(state, draftState => Object.assign(draftState, updates));
        }
    }
});

export const { setDice } = diceSlice.actions;
export default diceSlice.reducer;
