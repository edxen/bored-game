import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { setDice } from '../reducers/diceReducer';
import { TPlayer, setPlayer, setPlayers } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { TTile } from '../reducers/initialStates';

import SetElementOnFocus from '../hooks/SetElementOnFocus';
import GetData from '../hooks/GetData';

import config from '../config';
import { toggleGame, updateGame, updateRound, updateTurn } from '../reducers/gameReducer';

const RollDiceButton = () => {
    const dispatch = useDispatch();
    const { game, dice, players, tiles, getPlayerData, getPlayerTile, getTile } = GetData();
    const { round } = game;
    const rollButtonRef = useRef<HTMLButtonElement>(null);

    const handleClickRoll = () => {
        diceRoll();
    };

    const randomize = () => Math.floor(Math.random() * 6) + 1;
    const diceRoll = (force: number = 0) => {
        const rollResult = force ? force : randomize();
        const countInterval = 10;
        let count = force ? countInterval : 0;
        dispatch(toggleGame({ started: true }));
        dispatch(setDice({ done: false }));

        const playerData = getPlayerData(round.queue[0]);
        if (playerData) {
            const rollingInterval = setInterval(() => {
                if (count !== countInterval) {
                    dispatch(setDice({ display: randomize() }));
                    count++;
                } else {
                    clearInterval(rollingInterval);
                    dispatch(setDice({ display: 0, current: rollResult, move: true }));
                    dispatch(setPlayer({ id: playerData.id, last_path: playerData.path, roll: rollResult }));
                }
            }, config.rollSpeed);
        }
    };

    const TriggerOnMove = () => {
        useEffect(() => {
            let moveInterval: NodeJS.Timeout;

            if (dice.move) {
                const playerData = getPlayerData(round.queue[0]);
                const playerTile = getPlayerTile(round.queue[0]);
                if (playerData && playerTile) {
                    moveInterval = setInterval(() => {
                        if (playerData.last_path + playerData.roll !== playerData.path) {
                            playerMove(playerData);
                        } else {
                            clearInterval(moveInterval);

                            const removeOtherOccupants = (tile: TTile) => {
                                if (tile.occupants.length > 1 || (tile.occupants.length && tile.type === 'portal')) {
                                    const filteredPlayers = tile.occupants.filter((id: string) => id !== playerData.id);
                                    const removeFilteredPlayers = players.filter(player => !filteredPlayers.includes(player.id));
                                    dispatch(setPlayers(removeFilteredPlayers));
                                    if (filteredPlayers.length) {
                                        dispatch(updateGame({ target: 'ranking', value: [filteredPlayers[0]] }));
                                    }
                                    dispatch(setTile({ index: tile.index, key: 'occupants', value: [playerData.id] }));

                                    if (tile.occupants.length && tile.type === 'portal') {
                                        dispatch(setPlayer({ id: playerData.id, path: tile.path }));
                                    }
                                }
                            };
                            removeOtherOccupants(playerTile);

                            if (playerTile.type === 'portal') {
                                const warpTo = (nextPath: TTile['path']) => {
                                    const nextTile = getTile({ path: getPortalPath(nextPath) });
                                    movePlayerToNextTile(playerData, nextTile.path);
                                    dispatch(setPlayer({ id: playerData.id, index: nextTile.index, path: nextTile.path }));

                                    const portalTile = getTile({ path: nextPath });
                                    removeOtherOccupants(portalTile);
                                };

                                const { columns } = config.tiles.size;
                                const getPortalPath = (line: number) => (columns * line) + 6 - line;

                                switch (playerTile.path) {
                                    case getPortalPath(0): warpTo(2); break;
                                    case getPortalPath(1): warpTo(3); break;
                                    case getPortalPath(2): warpTo(0); break;
                                    case getPortalPath(3): warpTo(1); break;
                                }
                            }

                            dispatch(setDice({ move: false, done: true }));
                        }
                    }, config.moveSpeed);
                }
            }

            return () => clearInterval(moveInterval);
        }, [dice.move, players.find(p => p.id === round.queue[0])]); // eslint-disable-line react-hooks/exhaustive-deps
    };
    TriggerOnMove();

    const [countTurn, setCountTurn] = useState(1);

    useEffect(() => {
        if (game.started && dice.done) {
            dispatch(updateTurn({ target: 'next' }));
            if (countTurn === players.length) {
                setCountTurn(0);
                dispatch(updateRound());
            }
            setCountTurn(prevCount => prevCount + 1);
            dispatch(updateTurn({ target: 'counter' }));
        }
    }, [dice.done]); // eslint-disable-line react-hooks/exhaustive-deps

    const movePlayerToNextTile = (playerData: TPlayer, nextPath: TTile['path']) => {
        const playerTile = getPlayerTile(playerData.id);
        const nextTile = getTile({ path: nextPath });

        const tile = (tile: Pick<TTile, 'index'>) => tiles[tile.index];
        if (!tile(nextTile).occupants.includes(playerData.id)) {
            let updatedOccupants = [...tile(nextTile).occupants];
            updatedOccupants.unshift(playerData.id);
            dispatch(setTile({ index: nextTile.index, key: 'occupants', value: updatedOccupants }));

            updatedOccupants = tile(playerTile).occupants.filter(id => id !== playerData.id);
            dispatch(setTile({ index: playerTile.index, key: 'occupants', value: updatedOccupants }));
        }
    };

    const playerMove = (playerData: Required<TPlayer>) => {
        const playerTile = getPlayerTile(playerData.id);

        if (playerTile.index !== -1) {
            const maxPathLength = tiles.filter(tile => tile.edge === true).length;
            const nextTile = getTile({ path: (playerTile.path + 1 <= maxPathLength ? playerTile.path + 1 : 1) });
            movePlayerToNextTile(playerData, nextTile.path);

            const resetPlayerPathOnEnd = () => {
                if (playerData.last_path + playerData.roll > maxPathLength) {
                    let remainingRoll = playerData.roll - (maxPathLength - playerData.last_path);
                    dispatch(setPlayer({ id: playerData.id, last_path: 0, roll: remainingRoll > 0 ? remainingRoll : 0 }));
                }
            };
            dispatch(setPlayer({ id: playerData.id, index: nextTile.index, path: nextTile.path }));
            resetPlayerPathOnEnd();

        } else {
            console.error(`${playerData.id} not found`);
        }
    };

    useEffect(() => {
        const { queue } = round;
        if (queue.length > 1 && getPlayerData(queue[0]).type === 'computer') {
            diceRoll();
        }
        if (queue.length !== players.length) {
            const remainingPlayers = queue.filter((id) => players.some(player => player.id === id));
            dispatch(updateGame({ target: 'queue', value: remainingPlayers }));
        }
    }, [round]); // eslint-disable-line react-hooks/exhaustive-deps

    SetElementOnFocus({ condition: dice.done, elementRef: rollButtonRef });

    return (
        dice.done
            ?
            <div className='flex flex-col w-full'>
                <button ref={rollButtonRef} onClick={handleClickRoll} className='text-lg border rounded-md px-4 py-2 w-full'>Roll</button>
                {
                    config.enableSpecificDice &&
                    <div className='mt-2'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <button onClick={() => diceRoll(i + 1)} className='border rounded-md px-2 py-1 mx-1' key={i}> Move {i + 1}</button>
                        ))}
                    </div>
                }
            </div>
            :
            <div className='text-center text-lg border rounded-md px-4 py-2 w-full'>
                {dice.display ? `${round.queue[0]} rolling ${dice.display}` : `${round.queue.length && round.queue[0]} rolled ${dice.current}`}
            </div>
    );
};

export default RollDiceButton;