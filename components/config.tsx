import { TPlayer } from "./reducers/playersReducer";

const config = {
    enableSpecificDice: true,
    customPlayer: {
        enabled: true,
        state: [
            { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
            { id: 'playerb', type: 'ai', name: 'A1', path: 6, color: 'bg-blue-700' }
        ] as TPlayer[]
    }
};

export default config;