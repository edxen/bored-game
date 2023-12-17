import { combineReducers } from "redux";
import diceReducer from "./reducers/diceReducer";

export type RootState = ReturnType<typeof rootReducer>;

const rootReducer = combineReducers({
    dice: diceReducer,
    setDisplay: diceReducer,
    setCurrent: diceReducer,
    setDone: diceReducer,
    setTurn: diceReducer
});

export default rootReducer;
