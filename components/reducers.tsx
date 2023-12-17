import { combineReducers } from "redux";
import diceReducer from "./reducers/diceReducer";
import tilesReducer from "./reducers/tilesReducer";
import playersReducer from "./reducers/playersReducer";

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    dice: diceReducer,
    setDisplay: diceReducer,
    setCurrent: diceReducer,
    setDone: diceReducer,
    setTurn: diceReducer,
    tiles: tilesReducer,
    setTileProps: tilesReducer,
    players: playersReducer,
    setPlayer: playersReducer,
    setPlayers: playersReducer
});

export default rootReducer;
