import { useState, useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { updateRoundCounter } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { updatePhase } from '../reducers/gameReducer';

const HandlePreTurn = ({ dispatch, game }: Pick<THandleGameProps, 'dispatch' | 'game'>) => {
    const { phase, queue } = game.round;
    const { getPlayerData } = GetData();

    useEffect(() => {
        if (phase === 'pre') {
            if (queue.length && getPlayerData(queue[0]).type === 'computer') {
                dispatch(updatePhase({ phase: 'roll' }));
            }
        }
    }, [phase]);
};

const HandlePostTurn = ({ dispatch, game }: Pick<THandleGameProps, 'dispatch' | 'game'>) => {
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
    HandlePostTurn({ dispatch, game });
};

export default HandleRound;