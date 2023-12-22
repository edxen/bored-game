import { useState, useEffect } from 'react';

import HandleTurn from "./HandleTurn";
import { THandleGameProps } from './HandleGame';
import { updateRoundCounter } from '../reducers/gameReducer';

const HandleTurnUpdate = ({ dispatch, game, players, dice }: Omit<THandleGameProps, 'tiles'>) => {
    useEffect(() => {
        if (game.started && dice.done) {
            dispatch(updateRoundCounter());
        }
    }, [dice.done]); // eslint-disable-line react-hooks/exhaustive-deps
};

const HandlePreTurn = ({ dispatch, game, players, dice }: Omit<THandleGameProps, 'tiles'>) => {
    // console.log('pre turn check');
    // update round and turn counter

    HandleTurnUpdate({ dispatch, game, players, dice });
};

const HandlePostTurn = () => {
    // console.log('post turn check');

    const HandlePlayerRemoval = () => {
        // based on player positions on board, remove overlapping players besides the last to occupy
    };
};

const HandleRound = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    // console.log('start round');

    HandlePreTurn({ dispatch, game, players, dice });
    HandleTurn();
    HandlePostTurn();
};

export default HandleRound;