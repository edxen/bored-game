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

const config = {
    enableSpecificDice: false,
    customPlayer: {
        enabled: false,
        state: allhumans as TPlayer[]
    },
    moveSpeed: 0, // 100
    rollSpeed: 0 // 100
};

export default config;