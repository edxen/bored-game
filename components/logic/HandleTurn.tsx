import React, { useEffect } from 'react';

import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';

import { TDice, TPlayer, TPlayerAction, TTile, playerAction } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer } from '../reducers/playersReducer';
import { updateGame, updatePhase } from '../reducers/gameReducer';

import HandleDiceRoll from './handleTurn/handleDiceRoll';
import HandlePlayerActions from './handleTurn/handlePlayerActions';
import HandleExtraActions from './handleTurn/handleExtraActions';

export interface THandleTurnProps {
    dispatch: THandleGameProps['dispatch'];
    player: Required<TPlayer>,
    dice: TDice,
    getTile: ({ path }: { path: number; }) => TTile;
}

export const randomizedNumber = ({ min = 1, max = 6 }: Partial<Pick<TDice, 'min' | 'max'>>) => Math.floor(Math.random() * max) + min;

const HandleTurn = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
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
                HandlePlayerActions({ dispatch, player, tiles, getTile });
                break;
            case 'xaction':
                HandleExtraActions({ dispatch, player, players, getTile });
                break;
            case 'extra':
                const start = (key: keyof TPlayerAction) => {
                    dispatch(setPlayer({ id: player.id, extra: false, action: { ...player.action, [key]: false } }));
                    dispatch(updateGame({ target: 'history', value: [`Extra Action: ${player.name} used ${playerAction[key]}`] }));
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

                if (player.type === 'computer') {
                    const keys = ['cancel'];
                    Object.entries(player.action).forEach(([key, value]) => value && keys.push(key));
                    const key = keys[Math.floor(Math.random() * keys.length)];
                    handleExtra(key);
                }

                break;
        }
    }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
};

export default HandleTurn;;;;