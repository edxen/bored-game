import { THandleTurnProps, randomizedNumber } from "../HandleTurn";
import { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { setPlayer } from "@/components/reducers/playersReducer";
import { setDice } from "@/components/reducers/diceReducer";
import config from "@/components/configuration";
import { TPlayerActions, playerActions } from "../createPlayer";

const HandleExtraActions = ({ dispatch, player, queue }: Omit<THandleTurnProps, 'dice'> & { queue: string[]; }) => {

    const addExtraToPlayer = (rolled: keyof TPlayerActions) => {
        const actions = { [rolled]: true };
        dispatch(updateGame({ target: 'history', value: [`${player.name} rolled ${playerActions[rolled]}`] }));
        dispatch(setPlayer({ id: player.id, actions: { ...player.actions, ...actions } }));
    };

    const getAvailableExtraActions = () => {
        const actions = player.actions ?? false;
        const objActions = Object.values(actions);
        const objActionsList = Object.keys(playerActions);

        const list: string[] = [];

        if (objActions.every(prop => prop === true)) return list;

        objActionsList.forEach((key) => {
            if (!actions || !actions[key as keyof TPlayerActions]) {
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

    let rolled: keyof TPlayerActions;
    let display: string;

    const displayRandomFrom = (list: string[], label: string) => {
        rolled = list[randomizedNumber({ max: list.length }) - 1] as keyof TPlayerActions;
        display = playerActions[rolled];
        dispatch(setDice({ display: label, current: display.replace(' ', '-').toLowerCase() }));
    };

    const isAction = () => {
        if (queue.length === 1) dispatch(updatePhase({ phase: 'end' }));
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