import { setPlayer } from "@/components/reducers/playersReducer";
import { THandleTurnProps } from "../HandleTurn";
import { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { setDice } from "@/components/reducers/diceReducer";
import { TPlayerActions, playerActions } from "../createPlayer";
import { TTile } from "@/components/reducers/initialStates";
import config from "@/components/configuration";

const HandleExtra = ({ dispatch, player, tiles, getTile }: Pick<THandleTurnProps, 'dispatch' | 'player' | 'getTile'> & { tiles: TTile[]; }) => {
    const start = (key: keyof TPlayerActions) => {
        dispatch(setPlayer({ id: player.id, extra: false, actions: { ...player.actions, [key]: false } }));
        dispatch(updateGame({ target: 'history', value: [`Extra Action: ${player.name} used ${playerActions[key]}`] }));
        dispatch(setDice({ display: '' }));
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const handleExtra = (result: { key: string, force: number; }) => {
        const { key, force } = result;

        switch (key) {
            case 'exact':
                dispatch(setDice({ force }));
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

    const handleExtraAILogic = (keys: string[]): { key: string, force: number; } => {
        let key: string = 'cancel';
        let force: number = 0;

        //check next 6 Paths
        const currentTile = getTile({ path: player.path });
        const maxTilePath = (config.tiles.size.columns * 4) - 4;

        const nextPaths = Array.from({ length: 6 }).map((_, i) => {
            let nextPath = player.path + (i + 1);
            if (nextPath > maxTilePath) {
                nextPath = (i + 1) - (maxTilePath - currentTile.path);
            }
            return getTile({ path: nextPath });
        });

        let done = false;
        nextPaths.forEach((nextPath, i) => {
            const distance = i + 1;

            const setKey = () => {
                if (player.actions.exact) {
                    key = 'exact';
                    force = distance;
                } else if (player.actions.low && distance < 4) {
                    key = 'low';
                } else if (player.actions.high && distance > 3) {
                    key = 'high';
                } else if (player.actions.extra) {
                    key = 'extra';
                }
            };

            // player killer mode
            if (!done && nextPath.occupants.length > 0 && nextPath.type !== 'safe' && nextPath.type !== 'portal') {
                setKey();
                done = true;
            }

            // flag collector mode
            if (!done && !player.flags.includes(nextPath.flag) && nextPath.type === 'flag') {
                setKey();
                done = true;
            }
        });

        return { key, force };
    };

    const handleExtraAI = () => {
        if (player.type === 'computer') {
            const keys = ['cancel'];
            Object.entries(player.actions).forEach(([key, value]) => value && keys.push(key));
            const result = handleExtraAILogic(keys);
            handleExtra(result);
        }
    };

    return { handleExtraAI, handleExtra, start };
};

export default HandleExtra;