import { TPlayer, TPlayerAction, playerAction } from "@/components/reducers/initialStates";
import { THandleTurnProps, randomizedNumber } from "../HandleTurn";
import { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { setPlayer } from "@/components/reducers/playersReducer";
import { setDice } from "@/components/reducers/diceReducer";
import config from "@/components/configuration";

const HandleExtraActions = ({ dispatch, player, players, getTile }: Omit<THandleTurnProps, 'dice'> & { players: TPlayer[]; }) => {

    const addExtraToPlayer = (rolled: keyof TPlayerAction) => {
        const action = { [rolled]: true };
        dispatch(updateGame({ target: 'history', value: [`${player.name} rolled ${playerAction[rolled]}`] }));
        dispatch(setPlayer({ id: player.id, action: { ...player.action, ...action } }));
    };

    const getAvailableExtraActions = () => {
        const actions = player.action ?? false;
        const objActions = Object.keys(actions);
        const objActionsList = Object.keys(playerAction);

        let list: string[] = [];

        if (objActionsList.length === objActions.length) return list;
        objActionsList.forEach((key) => {
            if (!actions || !actions[key as keyof TPlayerAction]) {
                list.push(key);
            }
        });
        return list;
    };

    const doExtra = () => {
        if (player.extra) {
            dispatch(setPlayer({ id: player.id, extra: false }));
            dispatch(updatePhase({ phase: 'extra' }));
        } else {
            dispatch(updatePhase({ phase: 'end' }));
        }
    };

    let rolled: keyof TPlayerAction;
    let display: string;

    const displayRandomFrom = (list: string[], label: string) => {
        rolled = list[randomizedNumber({ max: list.length }) - 1] as keyof TPlayerAction;
        display = playerAction[rolled];
        dispatch(setDice({ display: label, current: display.replace(' ', '-').toLowerCase() }));
    };

    const isAction = () => {
        if (players.length === 1) dispatch(updatePhase({ phase: 'end' }));
        dispatch(updateGame({ target: 'history', value: [`${player.name} landed on extra dice zone`] }));

        const count = { current: config.actionInterval ?? 0, interval: 10 };
        const list = getAvailableExtraActions();
        if (!list.length) {
            dispatch(updateGame({ target: 'history', value: [`${player.name} skipped extra dice picking, all extra dice already obtained`] }));
            doExtra();
        } else {
            displayRandomFrom(list, 'Rolling');
            const actionInterval = setInterval(() => {
                if (count.current !== count.interval) {
                    displayRandomFrom(list, 'Rolling');
                    count.current++;
                } else {
                    clearInterval(actionInterval);
                    displayRandomFrom(list, 'Rolled');
                    addExtraToPlayer(rolled);

                    setTimeout(() => doExtra(), config.delay || 1000);
                }
            }, config.rollSpeed || 150);
        }

    };

    isAction();
};

export default HandleExtraActions;