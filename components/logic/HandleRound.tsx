import { useState, useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { toggleGame, updateQueuePlayers, updateRoundCounter } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { updatePhase } from '../reducers/gameReducer';
import { TPlayer, TTile } from '../reducers/initialStates';
import { setPlayers } from '../reducers/playersReducer';

const HandlePreTurn = ({ dispatch, game, players }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'>) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    useEffect(() => {
        if (phase === 'pre') {
            if (getPlayerData(queue[0])?.type === 'computer') {
                dispatch(updatePhase({ phase: 'roll' }));
            }
            if (players.length === 1) {
                dispatch(toggleGame({ over: true }));
            }
        }
    }, [phase]);
};

const HandlePostTurn = ({ dispatch, game, players, getTile }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'> & { getTile: ({ path }: { path: number; }) => TTile; }) => {
    const { phase, queue } = game.round;

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
            updateRemainingPlayers();
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