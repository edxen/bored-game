import React, { useEffect } from 'react';

import { THandleGameProps } from './HandleGame';
import { getSameSideColumn } from '../utils/helper';
import GetData from '../hooks/GetData';

import { TDice, TPlayer, TTile } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer, setPlayers } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { updateGame, updatePhase, updateQueuePlayers } from '../reducers/gameReducer';

import config from '../config';


const HandleDiceRoll = ({ dispatch, player, dice }: { dispatch: THandleGameProps['dispatch'], player: TPlayer, dice: TDice; }) => {
    const randomize = () => Math.floor(Math.random() * 6) + 1;

    const randomizeDiceDisplay = () => dispatch(setDice({ display: randomize() }));

    const diceRoll = () => {
        const countInterval = 10;
        let count = dice.force ? countInterval : config.diceInterval ? config.diceInterval : 0;

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                randomizeDiceDisplay();
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: dice.force ? dice.force : randomize() }));
                dispatch(updatePhase({ phase: 'action' }));
                dispatch(setDice({ force: 0, display: 0 }));
            }
        }, config.rollSpeed || 150);

        if (player) rollingInterval;
    };

    diceRoll();
};

interface THandlePlayerActions {
    dispatch: THandleGameProps['dispatch'];
    queue: string[],
    player: Required<TPlayer>,
    players: TPlayer[];
    tiles: TTile[];
    getTile: ({ path }: { path: number; }) => TTile;
}

const HandlePlayerActions = ({ dispatch, queue, player, players, tiles, getTile }: THandlePlayerActions) => {
    let currentPath = player.path;

    const endSequence = () => {
        dispatch(updatePhase({ phase: 'post' }));
    };

    const isOccupied = () => {
        const currentTile = getTile({ path: currentPath });
        if (currentTile.occupants.length) {
            const removePlayer = () => dispatch(setPlayers(players.filter(fPlayer => !currentTile.occupants.includes(fPlayer.id))));
            const removeOccupants = () => dispatch(setTile({ index: currentTile.index, key: 'occupants', value: [player.id] }));
            const updateQueue = () => dispatch(updateQueuePlayers(players.filter(fPlayers => !currentTile.occupants.includes(fPlayers.id))));
            const updateRanking = () => dispatch(updateGame({ target: 'ranking', value: currentTile.occupants }));

            updateQueue();
            updateRanking();
            removePlayer();
            removeOccupants();

        }
    };

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

        const totalPaths = tiles.filter(tile => tile.edge === true).length;

        let nextPath = targetPath + (prevPath ? 0 : 1);
        if (nextPath > totalPaths) {
            nextPath = 1;
            prevPath = totalPaths;
        }

        const lastTile = getTile({ path: prevPath ? prevPath : (nextPath - 1) });
        const nextTile = getTile({ path: nextPath });

        updateTileOccupants(nextTile.index, [player.id, ...nextTile.occupants]);
        updateTileOccupants(lastTile.index, lastTile.occupants.filter(id => id !== player.id));

        currentPath = nextTile.path;
        dispatch(setPlayer({ id: player.id, index: nextTile.index, path: nextTile.path, last_path: lastTile.path }));
    };

    const actionSequence = () => {
        isPortal();
        isOccupied();
        endSequence();
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
    const { getPlayerData, getTile } = GetData();
    const player = getPlayerData(queue[0]);

    useEffect(() => {
        switch (phase) {
            case 'roll':
                HandleDiceRoll({ dispatch, player, dice });
                break;
            case 'action':
                HandlePlayerActions({ dispatch, queue, player, players, tiles, getTile });
                break;
        }
    }, [phase]);
};

export default HandleTurn;