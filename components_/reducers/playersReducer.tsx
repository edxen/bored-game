import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { produce } from 'immer';

import { initialPlayerState, TPlayer } from "./initialStates";

const playersSlice = createSlice({
    name: 'players',
    initialState: initialPlayerState,
    reducers: {
        setPlayer: (state, action: PayloadAction<Partial<TPlayer>>) => {
            const { id, ...updates } = action.payload;
            return produce(state, draftState => {
                const player = draftState.find(s => s.id === id) as TPlayer;
                Object.assign(player, updates);
            });
        },
        setPlayers: (state, action: PayloadAction<TPlayer[]>) => action.payload
    }
});

export const { setPlayer, setPlayers } = playersSlice.actions;
export default playersSlice.reducer;
