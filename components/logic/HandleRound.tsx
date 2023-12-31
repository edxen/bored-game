import { useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { toggleGame, updateGame, updateQueuePlayers, updateRoundCounter } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { updatePhase } from '../reducers/gameReducer';
import { TTile } from '../reducers/initialStates';
import { setPlayer } from '../reducers/playersReducer';
import config from '../configuration';
import { TPlayer, TPlayerActions } from './createPlayer';

const HandlePreTurn = ({ dispatch, game, players }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'>) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    useEffect(() => {
        if (phase === 'change') {
            setTimeout(() => {
                dispatch(updatePhase({ phase: 'pre' }));
            }, config.delay || 1000);
        }

        if (phase === 'pre') {
            const currentPlayer = getPlayerData(queue[0]);
            dispatch(setPlayer({ id: currentPlayer.id, extra: true }));

            if (!currentPlayer.skip) {
                if (currentPlayer.type === 'computer') {
                    dispatch(updatePhase({ phase: 'roll' }));
                } else if (currentPlayer.auto) {
                    dispatch(updatePhase({ phase: 'roll' }));
                }
            } else {
                dispatch(setPlayer({ id: currentPlayer.id, skip: false }));
                dispatch(updateGame({ target: 'history', value: [`${getPlayerData(currentPlayer.id).name} is currenly in stop zone, movement will be allowed in next turn`] }));
                dispatch(updatePhase({ phase: 'end' }));
            }
        }
    }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
};

const HandlePostTurn = ({ dispatch, game, players, getTile }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'> & { getTile: ({ path }: { path: number; }) => TTile; }) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    const updateRemainingPlayers = (currentPlayer: TPlayer) => {
        const deadPlayers = players.reduce((count, current) => count += current.dead ? 1 : 0, 0);
        if ((deadPlayers + queue.length) !== players.length) {
            queue.forEach(queuePlayer => {
                const deadPlayer = getPlayerData(queuePlayer);
                if (deadPlayer.dead) {
                    const getDeadPlayerFlags = deadPlayer.flags.filter(flag => !currentPlayer.flags.includes(flag));
                    const getDeadPlayerActions = Object.entries(deadPlayer.actions).reduce((list: { [key: string]: boolean; }, action) => {
                        const [key, value] = action;
                        if (value) list[key] = true;
                        return list;
                    }, {});
                    dispatch(setPlayer({ id: currentPlayer.id, flags: [...currentPlayer.flags, ...getDeadPlayerFlags], actions: { ...currentPlayer.actions, ...getDeadPlayerActions } }));
                    dispatch(updateGame({ target: 'ranking', value: [deadPlayer.id] }));
                    dispatch(updateGame({ target: 'history', value: [`${currentPlayer.name} eliminated ${deadPlayer.name}`] }));
                    const remainingQueuePlayers = queue.filter(queuePlayer => queuePlayer !== deadPlayer.id);
                    dispatch(updateQueuePlayers(remainingQueuePlayers));
                }
            });
        }
    };

    useEffect(() => {
        if (phase === 'post') {
            const currentPlayer = getPlayerData(queue[0]);
            const currentTile = getTile({ path: currentPlayer.path });

            updateRemainingPlayers(currentPlayer);

            const extra = currentPlayer.actions && Object.values(currentPlayer.actions).some((value) => value === true);
            switch (true) {
                case (currentPlayer.flags.length === 4):
                    dispatch(updateQueuePlayers([currentPlayer.id]));
                    dispatch(updatePhase({ phase: 'end' }));
                    break;
                case currentPlayer.skip:
                    dispatch(updatePhase({ phase: 'end' }));
                    break;
                case (currentTile.type === 'dice'):
                    dispatch(updatePhase({ phase: 'xaction' }));
                    break;
                case (currentPlayer.extra && extra):
                    dispatch(setPlayer({ id: currentPlayer.id, extra: false }));
                    dispatch(updatePhase({ phase: 'extra' }));
                    break;
                default:
                    dispatch(updatePhase({ phase: 'end' }));
            }
        }

        if (phase === 'end') {
            if (queue.length !== 1) {
                dispatch(updateRoundCounter());
                dispatch(updatePhase({ phase: 'change' }));
            }
        }
    }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

};

const HandleGameEnd = ({ dispatch, game }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'> & { getTile: ({ path }: { path: number; }) => TTile; }) => {
    const { getPlayerData } = GetData();
    const { queue, count, turn } = game.round;

    useEffect(() => {
        if (queue.length === 1) {
            dispatch(toggleGame({ over: true }));
            dispatch(updateGame({ target: 'history', value: [`Game ended in ${count} rounds, total of ${turn} turns`] }));
            dispatch(updateGame({ target: 'history', value: [`Winner: ${getPlayerData(queue[0]).name}`] }));
        }
    }, [queue.length]); // eslint-disable-line react-hooks/exhaustive-deps
};

const HandleRound = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    const { getTile } = GetData();

    HandlePreTurn({ dispatch, game, players });
    HandleTurn({ dispatch, game, players, tiles, dice });
    HandlePostTurn({ dispatch, game, players, getTile });
    HandleGameEnd({ dispatch, game, players, getTile });
};

export default HandleRound;