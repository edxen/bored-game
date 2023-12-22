import { combineReducers } from "redux";

import gameReducer from "./reducers/gameReducer";
import diceReducer from "./reducers/diceReducer";
import tilesReducer from "./reducers/tilesReducer";
import playersReducer from "./reducers/playersReducer";

const rootReducer = combineReducers({
    game: gameReducer,
    dice: diceReducer,
    tiles: tilesReducer,
    players: playersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
