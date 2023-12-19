import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import generateTiles from "../utils/generateTiles";

export type TTile = {
    type: 'plain' | 'portal',
    occupants: string[];
    edge: boolean;
    path: number;
    index: number;
};

interface TileState extends Array<TTile> { }

export type TilePayload<K extends keyof TTile> = {
    index: number;
    key: K;
    value: TTile[K];
};

const tileSlice = createSlice({
    name: 'tiles',
    initialState: generateTiles({ columns: 10, rows: 10 }),
    reducers: {
        setTile: <K extends keyof TTile>(state: TileState, action: PayloadAction<TilePayload<K>>) => {
            const { index, key, value } = action.payload;
            state[index][key] = value;
        }
    }
});

export const { setTile } = tileSlice.actions;
export default tileSlice.reducer;
