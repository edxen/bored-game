import { TPlayer } from "./reducers/playersReducer";

const humanvscpu = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'computer', name: 'P2', path: 7, color: 'bg-blue-700' }
];

const allhumans = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'human', name: 'P2', path: 10, color: 'bg-blue-700' },
    { id: 'playerc', type: 'human', name: 'P3', path: 19, color: 'bg-orange-700' },
    { id: 'playerd', type: 'human', name: 'P4', path: 28, color: 'bg-green-700' },

];

const config = {
    enableSpecificDice: false,
    customPlayer: {
        enabled: false,
        state: allhumans as TPlayer[]
    }
};

export default config;