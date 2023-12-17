import { combineReducers } from "redux";

import diceReducer from "./reducers/diceReducer";
import tilesReducer from "./reducers/tilesReducer";
import playersReducer from "./reducers/playersReducer";
import turnsReducer from "./reducers/turnReducer";
export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    turns: turnsReducer,
    setTurn: turnsReducer,
    nextTurn: turnsReducer,
    dice: diceReducer,
    setDice: diceReducer,
    tiles: tilesReducer,
    setTile: tilesReducer,
    players: playersReducer,
    setPlayer: playersReducer,
    setPlayers: playersReducer
});

export default rootReducer;
