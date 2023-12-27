import React, { useEffect } from 'react';

import { THandleGameProps } from './HandleGame';
import { getSameSideColumn } from '../utils/helper';
import GetData from '../hooks/GetData';

import { TDice, TPlayer, TPlayerExtra, TTile, playerExtra } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer, setPlayers } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { updatePhase } from '../reducers/gameReducer';

import config from '../config';

interface THandleTurnProps {
    dispatch: THandleGameProps['dispatch'];
    player: Required<TPlayer>,
    dice: TDice,
    getTile: ({ path }: { path: number; }) => TTile;
}

const randomizedNumber = ({ max }: { max: number; }) => Math.floor(Math.random() * max) + 1;


const HandleDiceRoll = ({ dispatch, player, dice }: Omit<THandleTurnProps, 'getTile'>) => {
    const diceRoll = () => {
        const countInterval = 10;
        let count = dice.force ? countInterval : config.diceInterval ? config.diceInterval : 0;

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                dispatch(setDice({ display: `rolling ${randomizedNumber({ max: 6 })}`, current: randomizedNumber({ max: 6 }) }));
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setDice({ display: `rolled ${dice.current}` }));
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: dice.force ? dice.force : dice.current }));
                dispatch(setDice({ force: 0, display: `rolled ${dice.current}` }));
                dispatch(updatePhase({ phase: 'action' }));
            }
        }, config.rollSpeed || 150);

        if (player) rollingInterval;
    };

    diceRoll();
};

const HandlePlayerActions = ({ dispatch, player, tiles, getTile }: Omit<THandleTurnProps, 'dice'> & { tiles: TTile[]; }) => {
    let currentPath = player.path;
    const getCurrentTile = () => getTile({ path: currentPath });

    const endSequence = () => {
        const currentTile = getCurrentTile();
        if (currentTile.type !== 'dice') {
            dispatch(updatePhase({ phase: 'post' }));
        } else {
            dispatch(updatePhase({ phase: 'extra' }));
        }
    };

    const isSkip = () => {
        const currentTile = getCurrentTile();
        if (currentTile.type === 'stop') {
            dispatch(setPlayer({ id: player.id, skip: true }));
        }
    };

    const isOccupied = () => {
        const currentTile = getTile({ path: currentPath });
        if (currentTile.type !== 'safe' && currentTile.occupants.length) {
            const removeOccupants = () => dispatch(setTile({ index: currentTile.index, key: 'occupants', value: [player.id] }));
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
        isSkip();
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

const HandleExtraActions = ({ dispatch, player, dice, getTile }: THandleTurnProps) => {
    const getCurrentTile = () => getTile({ path: player.path });
    let rolled: keyof TPlayerExtra;
    let display: string;

    const displayRandomFrom = (list: string[], label: string) => {
        rolled = list[randomizedNumber({ max: list.length }) - 1] as keyof TPlayerExtra;
        display = playerExtra[rolled];
        dispatch(setDice({ display: `${label} ${display}` }));
    };

    const addExtraToPlayer = (rolled: keyof TPlayerExtra) => {
        const extra = { [rolled]: true };
        dispatch(setPlayer({ id: player.id, extra: { ...player.extra, ...extra } }));
    };

    const getAvailableExtraActions = () => {
        const list: string[] = [];
        Object.keys(playerExtra).forEach((key) => {
            if (!player.extra) list.push(key);
            if (player.extra && !Object.keys(player.extra).includes(key)) list.push(key);
        });
        return list;
    };

    const isExtra = () => {
        const count = { current: 0, interval: 10 };

        const list = getAvailableExtraActions();
        if (!list.length) return;

        const extraInterval = setInterval(() => {
            if (count.current !== count.interval) {
                displayRandomFrom(list, 'rolling');
                count.current++;
            } else {
                clearInterval(extraInterval);
                displayRandomFrom(list, 'rolled');
                addExtraToPlayer(rolled);

                dispatch(updatePhase({ phase: 'post' }));
            }
        }, config.rollSpeed || 150);
    };

    const currentTile = getCurrentTile();
    if (currentTile.type === 'dice') isExtra();
};

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
                HandlePlayerActions({ dispatch, player, tiles, getTile });
                break;
            case 'extra':
                HandleExtraActions({ dispatch, player, dice, getTile });
                break;
        }
    }, [phase]);
};

export default HandleTurn;