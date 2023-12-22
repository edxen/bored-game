import { useState, useEffect } from 'react';

import handleTurn from "./handleTurn";
import { THandleGameProps } from './handleGame';
import { updateRoundCounter } from '../reducers/gameReducer';

const handleTurnUpdate = ({ dispatch, game, players, dice }: Omit<THandleGameProps, 'tiles'>) => {
    useEffect(() => {
        if (game.started && dice.done) {
            dispatch(updateRoundCounter());
        }
    }, [dice.done]); // eslint-disable-line react-hooks/exhaustive-deps
};

const handlePreTurn = ({ dispatch, game, players, dice }: Omit<THandleGameProps, 'tiles'>) => {
    // console.log('pre turn check');
    // update round and turn counter

    handleTurnUpdate({ dispatch, game, players, dice });
};

const handlePostTurn = () => {
    // console.log('post turn check');

    const handlePlayerRemoval = () => {
        // based on player positions on board, remove overlapping players besides the last to occupy
    };
};

const handleRound = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    // console.log('start round');

    handlePreTurn({ dispatch, game, players, dice });
    handleTurn();
    handlePostTurn();
};

export default handleRound;