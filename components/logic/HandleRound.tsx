import { useState, useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { toggleGame, updateQueuePlayers, updateRoundCounter } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { updatePhase } from '../reducers/gameReducer';
import { TTile } from '../reducers/initialStates';
import { setPlayer, setPlayers } from '../reducers/playersReducer';

const HandlePreTurn = ({ dispatch, game, players }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'>) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    useEffect(() => {
        if (phase === 'pre') {
            const currentPlayer = getPlayerData(queue[0]);
            dispatch(setPlayer({ id: currentPlayer.id, extra: true }));

            if (!currentPlayer.skip) {
                if (currentPlayer?.type === 'computer') {
                    dispatch(updatePhase({ phase: 'roll' }));
                }
                if (players.length === 1) {
                    dispatch(toggleGame({ over: true }));
                }
            } else {
                dispatch(setPlayer({ id: currentPlayer.id, skip: false }));
                dispatch(updatePhase({ phase: 'post' }));
            }
        }
    }, [phase]);
};

const HandlePostTurn = ({ dispatch, game, players, getTile }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'> & { getTile: ({ path }: { path: number; }) => TTile; }) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    const updateRemainingPlayers = () => {
        const remainingPlayers = [] as string[];
        const removedPlayers = [] as string[];

        players.forEach((player) => {
            const occupants = getTile({ path: player.path }).occupants;
            occupants.forEach(occupant => {
                if (!remainingPlayers.includes(occupant)) {
                    remainingPlayers.push(occupant);
                }
            });
            if (!remainingPlayers.includes(player.id)) {
                removedPlayers.push(player.id);
            }
        });

        const remainingQueuePlayers = queue.filter(id => !removedPlayers.includes(id));
        dispatch(updateQueuePlayers(remainingQueuePlayers));
        dispatch(setPlayers(players.filter(player => !removedPlayers.includes(player.id))));
    };

    useEffect(() => {
        if (phase === 'post') {
            const currentPlayer = getPlayerData(queue[0]);
            const currentTile = getTile({ path: currentPlayer.path });

            updateRemainingPlayers();

            if (currentTile.type === 'dice') {
                dispatch(updatePhase({ phase: 'xaction' }));
            } else {
                const extra = currentPlayer.action && Object.values(currentPlayer.action).some((value) => value === true);
                if (currentPlayer.extra && extra) {
                    dispatch(setPlayer({ id: currentPlayer.id, extra: false }));
                    dispatch(updatePhase({ phase: 'extra' }));
                } else {
                    dispatch(updatePhase({ phase: 'end' }));
                }
            }
        }

        if (phase === 'end') {
            dispatch(updateRoundCounter());
            dispatch(updatePhase({ phase: 'pre' }));
        }
    }, [phase]);

};

const HandleRound = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    const { getTile } = GetData();

    HandlePreTurn({ dispatch, game, players });
    HandleTurn({ dispatch, game, players, tiles, dice });
    HandlePostTurn({ dispatch, game, players, getTile });
};

export default HandleRound;