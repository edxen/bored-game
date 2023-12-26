import { useState, useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { updateQueuePlayers, updateRoundCounter } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { updatePhase } from '../reducers/gameReducer';

const HandlePreTurn = ({ dispatch, game }: Pick<THandleGameProps, 'dispatch' | 'game'>) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    useEffect(() => {
        if (phase === 'pre') {
            if (getPlayerData(queue[0])?.type === 'computer')
                dispatch(updatePhase({ phase: 'roll' }));
        } else {
        }
    }, [phase]);
};

const HandlePostTurn = ({ dispatch, game, players }: Pick<THandleGameProps, 'dispatch' | 'game' | 'players'>) => {
    const { phase } = game.round;

    useEffect(() => {
        if (phase === 'post') {
            dispatch(updateRoundCounter());
            dispatch(updatePhase({ phase: 'pre' }));
        }
    }, [phase]);

};

const HandleRound = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    HandlePreTurn({ dispatch, game });
    HandleTurn({ dispatch, game, players, tiles, dice });
    HandlePostTurn({ dispatch, game, players });
};

export default HandleRound;