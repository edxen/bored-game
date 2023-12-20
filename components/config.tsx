import { TPlayer } from "./reducers/playersReducer";

const humanvscpu = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-300' },
    { id: 'playerb', type: 'computer', name: 'P2', path: 7, color: 'bg-blue-300' }
];

const allhumans = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-300' },
    { id: 'playerb', type: 'human', name: 'P2', path: 10, color: 'bg-blue-300' },
    { id: 'playerc', type: 'human', name: 'P3', path: 19, color: 'bg-orange-300' },
    { id: 'playerd', type: 'human', name: 'P4', path: 28, color: 'bg-green-300' },
];

const allcomputers = [
    { id: 'playera', type: 'computer', name: 'P1', path: 1, color: 'bg-red-300' },
    { id: 'playerb', type: 'computer', name: 'P2', path: 10, color: 'bg-blue-300' },
    // { id: 'playerc', type: 'computer', name: 'P3', path: 19, color: 'bg-orange-300' },
    // { id: 'playerd', type: 'computer', name: 'P4', path: 28, color: 'bg-green-300' },
];

const config = {
    enableSpecificDice: false,
    customPlayer: {
        enabled: true,
        state: allcomputers as TPlayer[]
    },
    moveSpeed: 200, // 150 - default
    rollSpeed: 150, // 150 - default,
    tiles: {
        gridColumns: 'grid-cols-11', // only update the number to change column size
        size: {
            columns: 0,
            rows: 11
        }
    }
};
const updateColumnsBasedOnGridColumns = () => config.tiles.size.columns = Number(config.tiles.gridColumns.replace('grid-cols-', ''));
updateColumnsBasedOnGridColumns();

export default config;