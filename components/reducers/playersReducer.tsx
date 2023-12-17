import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import config from "../config";

export type TPlayer = {
    id: string;
    type: 'human' | 'ai';
    name: string;
    path: number;
    color: string;
    index?: number;
    last_path?: number;
    roll?: number;
};

const playerState: TPlayer[] = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'ai', name: 'A1', path: 19, color: 'bg-blue-700' }
];

const initialState: TPlayer[] = config.customPlayer.enabled ? config.customPlayer.state : playerState;

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<Partial<TPlayer>>) => {
            const { id, index, path, last_path, roll } = action.payload;
            const player = state.find(s => s.id === id) as TPlayer;
            player.index = index !== undefined ? index : player.index;
            player.path = path !== undefined ? path : player.path;
            player.last_path = last_path !== undefined ? last_path : player.last_path;
            player.roll = roll !== undefined ? roll : player.roll;
        },
        setPlayers: (state, action: PayloadAction<TPlayer[]>) => {
            state.splice(0, state.length, ...action.payload);
        }
    }
});

export const { setPlayer, setPlayers } = playersSlice.actions;
export default playersSlice.reducer;
