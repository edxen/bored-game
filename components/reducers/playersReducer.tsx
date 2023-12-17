import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: TPlayer[] = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'ai', name: 'A1', path: 19, color: 'bg-blue-700' }
];

interface PlayerPayload extends Partial<Pick<TPlayer, 'index' | 'path' | 'last_path' | 'roll'>> {
    id: string;
}

const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
        setPlayer: (state, action: PayloadAction<PlayerPayload>) => {
            const { id, index, path, last_path, roll } = action.payload;
            const stateIndex = state.findIndex(s => s.id === id);
            state[stateIndex] = {
                ...state[stateIndex],
                ...(index !== undefined && { index }),
                ...(path !== undefined && { path }),
                ...(last_path !== undefined && { last_path }),
                ...(roll !== undefined && { roll })
            };
        },
        setPlayers: (state, action) => {
            state = action.payload;
        }
    }
});

export const { setPlayer, setPlayers } = playersSlice.actions;
export default playersSlice.reducer;
