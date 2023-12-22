import { combineReducers } from "redux";

import gameReducer from "./reducers/gameReducer";
import diceReducer from "./reducers/diceReducer";
import tilesReducer from "./reducers/tilesReducer";
import playersReducer from "./reducers/playersReducer";
import turnsReducer from "./reducers/turnReducer";

const rootReducer = combineReducers({
    game: gameReducer,
    turns: turnsReducer,
    dice: diceReducer,
    tiles: tilesReducer,
    players: playersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
