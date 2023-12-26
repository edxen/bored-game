import React, { useState, useEffect } from 'react';
import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';
import { TDice, TPlayer, TTile } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer, setPlayers } from '../reducers/playersReducer';
import { updateGame, updatePhase } from '../reducers/gameReducer';
import config from '../config';
import { cp } from 'fs';
import { setTile } from '../reducers/tilesReducer';
import { getSameSideColumn } from '../utils/helper';

const HandlePlayerActionChoice = ({ dispatch, queue, player }: { dispatch: THandleGameProps['dispatch'], queue: string[], player: TPlayer; }) => {
    const handleComputerTurn = () => {
        if (queue.length > 1 && player.type === 'computer') {
            // dice roll here
        }
    };
    handleComputerTurn();
};

const HandleDiceRoll = ({ dispatch, player, dice }: { dispatch: THandleGameProps['dispatch'], player: TPlayer, dice: TDice; }) => {
    const randomize = () => Math.floor(Math.random() * 6) + 1;

    const randomizeDiceDisplay = () => dispatch(setDice({ display: randomize() }));

    const diceRoll = () => {
        const countInterval = 10;
        let count = dice.force ? countInterval : 0;

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                randomizeDiceDisplay();
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: dice.force ?? randomize() }));
                dispatch(updatePhase({ phase: 'action' }));
                dispatch(setDice({ force: 0 }));
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
    let currentPath = player.path;

    const isPortal = () => {
        const currentTile = getTile({ path: currentPath });
        if (currentTile.type === 'portal') {
            const getPortalPath = (index: number) => getSameSideColumn(index, 6);
            const warpTo = (portalPath: number) => {
                const warpPath = getTile({ path: getPortalPath(portalPath) }).path;
                moveToNextTile(warpPath, currentPath);
            };

            switch (currentTile.path) {
                case getPortalPath(0): warpTo(2); break;
                case getPortalPath(1): warpTo(3); break;
                case getPortalPath(2): warpTo(0); break;
                case getPortalPath(3): warpTo(1); break;
            }
        }
    };

    const moveToNextTile = (targetPath: number, prevPath?: number) => {
        const updateTileOccupants = (index: number, occupants: string[]) => dispatch(setTile({ index, key: 'occupants', value: occupants }));

        const nextPath = targetPath + (prevPath ? 0 : 1);
        const lastTile = getTile({ path: prevPath ? prevPath : (nextPath - 1) });
        const nextTile = getTile({ path: nextPath });

        updateTileOccupants(nextTile.index, [playerId, ...nextTile.occupants]);
        updateTileOccupants(lastTile.index, lastTile.occupants.filter(id => id !== playerId));
        currentPath = nextTile.path;
        dispatch(setPlayer({ id: playerId, index: nextTile.index, path: nextTile.path, last_path: lastTile.path }));
    };

    const actionSequence = () => {
        isPortal();
    };

    let moveCounter = 0;
    const actionInterval = setInterval(() => {
        if (moveCounter !== player.roll) {
            moveToNextTile(currentPath);
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
                HandleDiceRoll({ dispatch, player, dice });
                break;
            case 'action':
                HandlePlayerActions({ dispatch, players, tiles, playerId, player, playerTile, getTile });
                break;
        }
    }, [phase]);
};

export default HandleTurn;