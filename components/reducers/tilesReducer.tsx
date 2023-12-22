import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import generateTiles from "../utils/generateTiles";
import config from "../config";
import { produce } from "immer";
import { TilePayload, TTile } from "./initialStates";

const tileSlice = createSlice({
    name: 'tiles',
    initialState: generateTiles({ ...config.tiles.size }),
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
