import React, { useEffect } from 'react';
import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';
import { TPlayer, TTile } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer, setPlayers } from '../reducers/playersReducer';
import { updateGame, updatePhase } from '../reducers/gameReducer';
import config from '../config';
import { cp } from 'fs';
import { setTile } from '../reducers/tilesReducer';

const HandlePlayerActionChoice = ({ dispatch, queue, player }: { dispatch: THandleGameProps['dispatch'], queue: string[], player: TPlayer; }) => {
    const handleComputerTurn = () => {
        if (queue.length > 1 && player.type === 'computer') {
            // dice roll here
        }
    };
    handleComputerTurn();
};

const HandleDiceRoll = ({ dispatch, player }: { dispatch: THandleGameProps['dispatch'], player: TPlayer; }) => {
    const randomize = () => Math.floor(Math.random() * 6) + 1;

    const randomizeDiceDisplay = () => dispatch(setDice({ display: randomize() }));

    const diceRoll = (force: Partial<number> = 0) => {
        const countInterval = 10;
        let count = force ? countInterval : 0;

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                randomizeDiceDisplay();
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: force ? force : randomize() }));
                dispatch(updatePhase({ phase: 'action' }));
            }
        }, config.rollSpeed || 150);

        if (player) rollingInterval;
    };

    diceRoll();
};

interface THandlePlayerActions {
    dispatch: THandleGameProps['dispatch'];
    players: TPlayer[];
    tiles: TTile[];
    playerId: string;
    player: Required<TPlayer>,
    playerTile: TTile,
    getTile: ({ path }: { path: number; }) => TTile;
}

const HandlePlayerActions = ({ dispatch, players, tiles, playerId, player, playerTile, getTile }: THandlePlayerActions) => {
    const moveToNextTile = (playerTile: TTile, moveCounter: number) => {
        const updateTileOccupants = (index: number, occupants: string[]) => dispatch(setTile({ index, key: 'occupants', value: occupants }));

        const nextPath = playerTile.path + moveCounter;
        const lastTile = getTile({ path: nextPath - 1 });
        const nextTile = getTile({ path: nextPath });

        updateTileOccupants(nextTile.index, [playerId, ...nextTile.occupants]);
        updateTileOccupants(lastTile.index, lastTile.occupants.filter(id => id !== playerId));
    };

    const actionSequence = () => {
    };

    let moveCounter = 0;
    const actionInterval = setInterval(() => {
        if (moveCounter !== player.roll) {
            moveToNextTile(playerTile, moveCounter + 1);
            moveCounter++;
        } else {
            clearInterval(actionInterval);
            actionSequence();
        }
    }, config.moveSpeed || 150);

    actionInterval;
};

const HandleTurn = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    const { round } = game;
    const { phase, queue } = round;
    const { getPlayerData, getPlayerTile, getTile } = GetData();
    const player = getPlayerData(queue[0]);
    const playerTile = getPlayerTile(queue[0]);
    const playerId = queue[0] ?? '';

    useEffect(() => {
        switch (phase) {
            case 'pre':
                HandlePlayerActionChoice({ dispatch, queue, player });
                break;
            case 'roll':
                HandleDiceRoll({ dispatch, player });
                break;
            case 'action':
                HandlePlayerActions({ dispatch, players, tiles, playerId, player, playerTile, getTile });
                break;
        }
    }, [phase]);
};

export default HandleTurn;