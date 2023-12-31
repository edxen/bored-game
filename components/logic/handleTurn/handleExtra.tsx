import { setPlayer } from "@/components/reducers/playersReducer";
import { THandleTurnProps } from "../HandleTurn";
import { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { setDice } from "@/components/reducers/diceReducer";
import { TPlayerActions, playerActions } from "../createPlayer";

const HandleExtra = ({ dispatch, player }: Pick<THandleTurnProps, 'dispatch' | 'player'>) => {
    const start = (key: keyof TPlayerActions) => {
        dispatch(setPlayer({ id: player.id, extra: false, actions: { ...player.actions, [key]: false } }));
        dispatch(updateGame({ target: 'history', value: [`Extra Action: ${player.name} used ${playerActions[key]}`] }));
        dispatch(setDice({ display: '' }));
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const handleExtra = (key: string) => {
        switch (key) {
            case 'exact':
                start(key);
                break;
            case 'high':
                dispatch(setDice({ min: 4, max: 3 }));
                start(key);
                break;
            case 'low':
                dispatch(setDice({ min: 1, max: 3 }));
                start(key);
                break;
            case 'extra':
                dispatch(updatePhase({ phase: 'roll' }));
                start(key);
                break;
            case 'cancel':
                dispatch(updatePhase({ phase: 'end' }));
                dispatch(updateGame({ target: 'history', value: [`${player.name} skipped extra action`] }));
                break;
        }
    };

    const handleExtraAI = () => {
        if (player.type === 'computer') {
            const keys = ['cancel'];
            Object.entries(player.actions).forEach(([key, value]) => value && keys.push(key));
            const key = keys[Math.floor(Math.random() * keys.length)];
            handleExtra(key);
        }
    };

    return { handleExtraAI, handleExtra, start };
};

export default HandleExtra;