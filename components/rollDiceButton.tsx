import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { setDice } from './reducers/diceReducer';
import { TPlayer, setPlayer, setPlayers } from './reducers/playersReducer';
import { setTileProps } from './reducers/tilesReducer';

import { TTile } from './interface';
import setElementOnFocus from './setElementOnFocus';
import getData from './getData';

const RollDiceButton = () => {
    const dispatch = useDispatch();
    const { dice, players, tiles, getPlayerData, getPlayerTile } = getData();
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
                dispatch(setDice({ display: 0, current: rollResult, id: playerData.id, move: true }));
                dispatch(setPlayer({ id: playerData.id, last_path: playerData.path, roll: rollResult }));
            }
        }, 100);
    };

    const triggerOnMove = () => {
        useEffect(() => {
            let moveInterval: NodeJS.Timeout;

            if (dice.move) {
                const playerData = getPlayerData(dice.id);
                const playerTile = getPlayerTile(dice.id);
                moveInterval = setInterval(() => {
                    if (playerData.last_path + playerData.roll !== playerData.path) {
                        playerMove(playerData);
                    } else {
                        clearInterval(moveInterval);
                        dispatch(setDice({ id: '', move: false, done: true, turn: dice.turn === 'human' ? 'ai' : 'human' }));
                        if (playerTile.occupants.length > 1 && playerData.last_path + playerData.roll === playerData.path) {
                            const filteredPlayers = playerTile.occupants.filter((id: string) => id !== playerData.id);
                            dispatch(setPlayers(players.filter(player => !filteredPlayers.includes(player.id))));
                            dispatch(setTileProps({ index: playerTile.index, key: 'occupants', value: [playerData.id] }));
                        }
                    }
                }, 200);
            }

            return () => clearInterval(moveInterval);
        }, [dice.move, players.find(p => p.id === dice.id)]); // eslint-disable-line react-hooks/exhaustive-deps
    };
    triggerOnMove();

    const playerMove = (playerData: Required<TPlayer>) => {
        const playerTile = getPlayerTile(playerData.id);

        if (playerTile.index !== -1) {
            const maxPathLength = tiles.filter(tile => tile.edge === true).length;
            const nextTile = tiles.find(tile => tile.path === (playerTile.path + 1 <= maxPathLength ? playerTile.path + 1 : 1)) as TTile;
            if (nextTile.index !== -1) {
                const movePlayerToNextTile = () => {
                    const tile = (tile: Pick<TTile, 'index'>) => tiles[tile.index];
                    if (!tile(nextTile).occupants.includes(playerData.id)) {
                        let updatedOccupants = [...tile(nextTile).occupants];
                        updatedOccupants.push(playerData.id);
                        dispatch(setTileProps({ index: nextTile.index, key: 'occupants', value: updatedOccupants }));

                        updatedOccupants = tile(playerTile).occupants.filter(id => id !== playerData.id);
                        dispatch(setTileProps({ index: playerTile.index, key: 'occupants', value: updatedOccupants }));
                    }
                };
                movePlayerToNextTile();

                const resetPlayerPathOnEnd = () => {
                    if (playerData.last_path + playerData.roll > maxPathLength) {
                        let remainingRoll = playerData.roll - (maxPathLength - playerData.last_path);
                        dispatch(setPlayer({ id: playerData.id, last_path: 0, roll: remainingRoll > 0 ? remainingRoll : 0 }));
                    }
                };
                dispatch(setPlayer({ id: playerData.id, index: nextTile.index, path: nextTile.path }));
                resetPlayerPathOnEnd();
            } else {
                console.error(`${nextTile.path} not found`);
            }
        } else {
            console.error(`${playerData.id} not found`);
        }
    };

    useEffect(() => {
        if (players.length > 1 && dice.turn === 'ai') {
            diceRoll({ id: 'playerb' }, 0);
        }
    }, [dice.turn]); // eslint-disable-line react-hooks/exhaustive-deps

    setElementOnFocus({ condition: dice.done, elementRef: rollButtonRef });

    return (
        dice.done
            ?
            <>
                <button ref={rollButtonRef} onClick={handleClickRoll} className='text-lg border rounded-md px-4 py-2 w-full'>Roll</button>
                {/* {Array.from({ length: 6 }).map((_, i) => (
                    <button onClick={() => diceRoll({ id: 'playera' }, i + 1)} className='border rounded-md px-2 py-1' key={i}> Move {i + 1}</button>
                ))} */}
            </>
            :
            <p>{dice.display ? `${dice.turn} rolling ${dice.display}` : `${dice.turn} rolled ${dice.current}`}</p>

    );
};

export default RollDiceButton;