import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import generateTiles from "../utils/generateTiles";
import config from "../config";

export type TTile = {
    type: 'plain' | 'portal' | 'dice' | 'flag' | 'safe' | 'stop' | 'arrow-up' | 'arrow-down' | 'arrow-left' | 'arrow-right' | 'arrow-up-left' | 'arrow-up-right' | 'arrow-down-left' | 'arrow-down-right';

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
    initialState: generateTiles({ ...config.tiles.size }),
    reducers: {
        setTile: <K extends keyof TTile>(state: TileState, action: PayloadAction<TilePayload<K>>) => {
            const { index, key, value } = action.payload;
            state[index][key] = value;
        }
    }
});

export const { setTile } = tileSlice.actions;
export default tileSlice.reducer;
