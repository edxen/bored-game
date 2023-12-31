import React, { useEffect } from 'react';

import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';

import { TDice, TTile } from '../reducers/initialStates';

import HandleDiceRoll from './handleTurn/handleDiceRoll';
import HandlePlayerActions from './handleTurn/handlePlayerActions';
import HandleExtraActions from './handleTurn/handleExtraActions';
import { TPlayer } from './createPlayer';
import HandleExtra from './handleTurn/handleExtra';

export interface THandleTurnProps {
    dispatch: THandleGameProps['dispatch'];
    player: Required<TPlayer>,
    dice: TDice,
    getTile: ({ path }: { path: number; }) => TTile;
}

export const randomizedNumber = ({ min = 1, max = 6 }: Partial<Pick<TDice, 'min' | 'max'>>) => Math.floor(Math.random() * max) + min;

const HandleTurn = ({ dispatch, game, tiles, dice }: THandleGameProps) => {
    const { round } = game;
    const { phase, queue } = round;
    const { getPlayerData, getTile } = GetData();
    const player = getPlayerData(queue[0]);

    useEffect(() => {
        switch (phase) {
            case 'roll':
                HandleDiceRoll({ dispatch, player, dice });
                break;
            case 'action':
                HandlePlayerActions({ dispatch, game, player, tiles, getTile });
                break;
            case 'xaction':
                HandleExtraActions({ dispatch, player, queue, getTile });
                break;
            case 'extra':
                const { handleExtraAI } = HandleExtra({ dispatch, player });
                handleExtraAI();
                break;
        }
    }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default HandleTurn;