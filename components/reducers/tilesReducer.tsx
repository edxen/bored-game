import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from "immer";

import { initialTileState, TilePayload, TTile } from "./initialStates";

const tileSlice = createSlice({
    name: 'tiles',
    initialState: initialTileState,
    reducers: {
        setTile: <K extends keyof TTile>(state: TTile[], action: PayloadAction<TilePayload<K>>) => {
            const { index, key, value } = action.payload;
            return produce(state, draftState => {
                draftState[index][key] = value;
            });
        }
    }
});

export const { setTile } = tileSlice.actions;
export default tileSlice.reducer;
