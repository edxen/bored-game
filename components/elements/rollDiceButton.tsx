import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { setDice } from '../reducers/diceReducer';
import { TPlayer, setPlayer, setPlayers } from '../reducers/playersReducer';
import { TTile, setTile } from '../reducers/tilesReducer';

import setElementOnFocus from '../hooks/setElementOnFocus';
import getData from '../hooks/getData';

import config from '../config';
import { nextTurn } from '../reducers/turnReducer';

const RollDiceButton = () => {
    const dispatch = useDispatch();
    const { turns, dice, players, tiles, getPlayerData, getPlayerTile, getTile } = getData();
    const rollButtonRef = useRef<HTMLButtonElement>(null);


    const handleClickRoll = () => {
        diceRoll({ id: 'playera' }, 0);
    };

    const randomize = () => Math.floor(Math.random() * 6) + 1;
    const diceRoll = (player: Pick<TPlayer, 'id'>, force: number) => {
        const rollResult = force ? force : randomize();
        const countInterval = 10;
        let count = force ? countInterval : 0;
        dispatch(setDice({ done: false }));

        const playerData = getPlayerData(player.id);

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                dispatch(setDice({ display: randomize() }));
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setDice({ display: 0, current: rollResult, move: true }));
                dispatch(setPlayer({ id: playerData.id, last_path: playerData.path, roll: rollResult }));
            }
        }, 100);
    };

    const triggerOnMove = () => {
        useEffect(() => {
            let moveInterval: NodeJS.Timeout;

            if (dice.move) {
                const playerData = getPlayerData(turns[0].id);
                const playerTile = getPlayerTile(turns[0].id);
                moveInterval = setInterval(() => {
                    if (playerData.last_path + playerData.roll !== playerData.path) {
                        playerMove(playerData);
                    } else {
                        clearInterval(moveInterval);

                        const removeOtherOccupants = (tile: TTile) => {
                            if (tile.occupants.length) {
                                const filteredPlayers = tile.occupants.filter((id: string) => id !== playerData.id);
                                const removeFilteredPlayers = players.filter(player => !filteredPlayers.includes(player.id));
                                dispatch(setPlayers(removeFilteredPlayers));
                                dispatch(setTile({ index: tile.index, key: 'occupants', value: [playerData.id] }));
                            }
                        };
                        removeOtherOccupants(playerTile);

                        if (playerTile.type === 'portal') {
                            const warpTo = (nextPath: TTile['path']) => {
                                const nextTile = getTile({ path: nextPath });
                                movePlayerToNextTile(playerData, nextTile.path);
                                dispatch(setPlayer({ id: playerData.id, index: nextTile.index, path: nextTile.path }));

                                const portalTile = getTile({ path: nextPath });
                                removeOtherOccupants(portalTile);
                            };

                            switch (playerTile.path) {
                                case 6: warpTo(24); break;
                                case 15: warpTo(33); break;
                                case 24: warpTo(6); break;
                                case 33: warpTo(15); break;
                            }
                        }

                        dispatch(setDice({ move: false, done: true }));
                        dispatch(nextTurn());
                    }
                }, 200);
            }

            return () => clearInterval(moveInterval);
        }, [dice.move, players.find(p => p.id === turns[0]?.id)]); // eslint-disable-line react-hooks/exhaustive-deps
    };
    triggerOnMove();

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
        if (turns.length > 1 && turns[0].type === 'ai') {
            diceRoll({ id: turns[0].id }, 0);
        }
    }, [turns]); // eslint-disable-line react-hooks/exhaustive-deps

    setElementOnFocus({ condition: dice.done, elementRef: rollButtonRef });

    return (
        dice.done
            ?
            <div className='flex flex-col w-full'>
                <button ref={rollButtonRef} onClick={handleClickRoll} className='text-lg border rounded-md px-4 py-2 w-full'>Roll</button>
                {
                    config.enableSpecificDice &&
                    <div className='mt-2'>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <button onClick={() => diceRoll({ id: 'playera' }, i + 1)} className='border rounded-md px-2 py-1 mx-1' key={i}> Move {i + 1}</button>
                        ))}
                    </div>
                }
            </div>
            :
            <p>{dice.display ? `${turns[0].name} rolling ${dice.display}` : `${turns[0].name} rolled ${dice.current}`}</p>

    );
};

export default RollDiceButton;