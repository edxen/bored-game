import { combineReducers } from "redux";

import diceReducer from "./reducers/diceReducer";
import tilesReducer from "./reducers/tilesReducer";
import playersReducer from "./reducers/playersReducer";
import turnsReducer from "./reducers/turnReducer";

const rootReducer = combineReducers({
    turns: turnsReducer,
    dice: diceReducer,
    tiles: tilesReducer,
    players: playersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
