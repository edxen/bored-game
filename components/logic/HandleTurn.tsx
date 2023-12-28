import React, { useEffect } from 'react';

import { THandleGameProps } from './HandleGame';
import { getSameSideColumn } from '../utils/helper';
import GetData from '../hooks/GetData';

import { TDice, TPlayer, TPlayerAction, TTile, playerAction } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { updatePhase } from '../reducers/gameReducer';

import config from '../configuration';

interface THandleTurnProps {
    dispatch: THandleGameProps['dispatch'];
    player: Required<TPlayer>,
    dice: TDice,
    getTile: ({ path }: { path: number; }) => TTile;
}

const randomizedNumber = ({ min = 1, max = 6 }: Partial<Pick<TDice, 'min' | 'max'>>) => Math.floor(Math.random() * max) + min;

const HandleDiceRoll = ({ dispatch, player, dice }: Omit<THandleTurnProps, 'getTile'>) => {
    const diceRoll = () => {
        const countInterval = 10;
        let count = dice.force !== 0 ? countInterval : config.diceInterval ? config.diceInterval : 0;
        let rolled: number = dice.force !== 0 ? dice.force : 1;
        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                rolled = randomizedNumber({ min: dice.min, max: dice.max });
                dispatch(setDice({ display: 'Rolling', current: rolled }));
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setDice({ min: 1, max: 6, force: 0, display: 'Rolled', current: rolled }));
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: rolled }));
                setTimeout(() => dispatch(updatePhase({ phase: 'action' })), config.delay || 1000);
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
        dispatch(updatePhase({ phase: 'post' }));
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

const HandleExtraActions = ({ dispatch, player, players, getTile }: Omit<THandleTurnProps, 'dice'> & { players: TPlayer[]; }) => {

    const addExtraToPlayer = (rolled: keyof TPlayerAction) => {
        const action = { [rolled]: true };
        dispatch(setPlayer({ id: player.id, action: { ...player.action, ...action } }));
    };

    const getAvailableExtraActions = () => {
        const actions = player.action ?? false;
        const objActions = Object.keys(actions);
        const objActionsList = Object.keys(playerAction);

        let list: string[] = [];
        objActionsList.forEach((key) => {
            if (!actions) {
                list.push(key);
            } else {
                if (!actions[key as keyof TPlayerAction]) list.push(key);
                if (objActionsList.length === objActions.length) list = objActionsList;
            }
        });
        return list;
    };

    const doExtra = () => {
        if (player.extra) {
            dispatch(setPlayer({ id: player.id, extra: false }));
            dispatch(updatePhase({ phase: 'extra' }));
        } else {
            dispatch(updatePhase({ phase: 'end' }));
        }
    };

    let rolled: keyof TPlayerAction;
    let display: string;

    const displayRandomFrom = (list: string[], label: string) => {
        rolled = list[randomizedNumber({ max: list.length }) - 1] as keyof TPlayerAction;
        display = playerAction[rolled];
        dispatch(setDice({ display: label, current: display.replace(' ', '-').toLowerCase() }));
    };

    const isAction = () => {
        if (players.length === 1) dispatch(updatePhase({ phase: 'end' }));

        const count = { current: config.actionInterval ?? 0, interval: 10 };
        const list = getAvailableExtraActions();
        if (!list.length) doExtra();

        displayRandomFrom(list, 'Rolling');
        const actionInterval = setInterval(() => {
            if (count.current !== count.interval) {
                displayRandomFrom(list, 'Rolling');
                count.current++;
            } else {
                clearInterval(actionInterval);
                displayRandomFrom(list, 'Rolled');
                addExtraToPlayer(rolled);

                setTimeout(() => doExtra(), config.delay || 1000);
            }
        }, config.rollSpeed || 150);
    };

    isAction();
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
                HandlePlayerActions({ dispatch, player, tiles, getTile });
                break;
            case 'xaction':
                HandleExtraActions({ dispatch, player, players, getTile });
                break;
            case 'extra':

                const start = (key: keyof TPlayerAction) => {
                    dispatch(setPlayer({ id: player.id, extra: false, action: { ...player.action, [key]: false } }));
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
                        case 'cancel': dispatch(updatePhase({ phase: 'end' })); break;
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

export default HandleTurn;