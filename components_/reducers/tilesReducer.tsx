import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type TTile = {
    type: 'plain' | 'portal',
    occupants: string[];
    edge: boolean;
    path: number;
    index: number;
};

const generateTiles = (columns: number, rows: number): TTile[] => {
    return Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const isEdge = row === 0 || row === rows - 1 || column === 0 || column === columns - 1;

        const getPath = (): number => {
            if (row === 0) {
                return column + 1;
            } else if (column === columns - 1 && row !== rows - 1) {
                return columns + row;
            } else if (row === rows - 1 && column !== 0) {
                return columns * 2 + (columns - column) - 2;
            } else if (column === 0) {
                return (columns * 3) + (rows - row) - 3;
            }
            return 0;
        };

        let type: TTile['type'] = 'plain';

        const setPortalTiles = () => {
            if ([6, 15, 24, 33].includes(getPath())) {
                type = 'portal';
            }
        };
        setPortalTiles();

        return {
            index,
            type,
            occupants: [],
            edge: isEdge,
            path: isEdge ? getPath() : 0
        };
    });
};

interface TileState extends Array<TTile> { }

export type TilePayload<K extends keyof TTile> = {
    index: number;
    key: K;
    value: TTile[K];
};

const tileSlice = createSlice({
    name: 'tiles',
    initialState: generateTiles(10, 10),
    reducers: {
        setTile: <K extends keyof TTile>(state: TileState, action: PayloadAction<TilePayload<K>>) => {
            const { index, key, value } = action.payload;
            state[index][key] = value;
        }
    }
});

export const { setTile } = tileSlice.actions;
export default tileSlice.reducer;
