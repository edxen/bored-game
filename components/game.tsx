import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { TTile } from '@/components/interface';
import { TDice } from './reducers/diceReducer';
import setElementOnFocus from './setElementOnFocus';
import Tile from './tile';

import { useDispatch, useSelector } from 'react-redux';
import { setDice } from './reducers/diceReducer';
import { setTileProps } from './reducers/tilesReducer';
import { RootState } from './reducers';
import { setPlayer, setPlayers, TPlayer } from './reducers/playersReducer';

const AddPlayers = (players: TPlayer[], tiles: TTile[], setTileProps: any) => { // get back to this
    const dispatch = useDispatch();
    useEffect(() => {
        const addPlayer = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTileProps({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };
        players.map((player) => addPlayer(player));
    }, []);
};

export default function Game() {
    const dispatch = useDispatch();
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const tiles: TTile[] = useSelector((state: RootState) => state.tiles);
    const players: TPlayer[] = useSelector((state: RootState) => state.players);
    const rollButtonRef = useRef<HTMLButtonElement>(null);

    AddPlayers(players, tiles, setTileProps);

    const getPlayerData = (id: TPlayer['id']) => players.find(p => p.id === id) as Required<TPlayer>;
    const getPlayerTile = (id: TPlayer['id']) => tiles.find(tile => tile.occupants.includes(id)) as TTile;

    const diceRoll = (player: Pick<TPlayer, 'id'>, force: number) => {
        const randomize = () => Math.floor(Math.random() * 6) + 1;
        const rollResult = force ? force : randomize();
        let count = force ? 10 : 0;

        dispatch(setDice({ done: false }));

        const playerData = getPlayerData(player.id);
        const playerTile = getPlayerTile(player.id);

        const rollingInterval = setInterval(() => {
            if (count === 10) {
                clearInterval(rollingInterval);
                dispatch(setDice({ display: 0, current: rollResult }));
                dispatch(setPlayer({ id: playerData.id, last_path: playerData.path, roll: rollResult }));

                const moveInterval = setInterval(() => {
                    if (playerData.last_path + playerData.roll === playerData.path) {
                        dispatch(setDice({ done: true, turn: dice.turn === 'human' ? 'ai' : 'human' }));
                        clearInterval(moveInterval);
                        if (playerTile.occupants.length > 1) {
                            if (playerData.last_path + playerData.roll === playerData.path) {
                                const filteredPlayers = playerTile.occupants.filter(id => id !== player.id);
                                dispatch(setPlayers(players.filter(player => !filteredPlayers.includes(player.id))));
                                dispatch(setTileProps({ index: playerTile.index, key: 'occupants', value: [player.id] }));
                            }
                        }
                    } else {
                        playerMove(playerData);
                    }
                }, 200);
            } else {
                dispatch(setDice({ display: randomize() }));
                count++;
            }
        }, 100);
    };

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

    const router = useRouter();
    const handleRestart = () => {
        router.reload();
    };

    return (
        <div className='p-4'>
            <div className='relative grid my-2'>
                <div className="h-full w-full grid gap-4 grid-cols-10 justify-center items-center">
                    {
                        tiles.map((e, i) => (
                            <Tile
                                key={i}
                                players={players}
                                edge={e.edge}
                                path={e.path}
                                occupants={e.occupants}
                            />
                        ))
                    }
                </div>

                <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                    <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col justify-center items-center">
                        {
                            players.length > 1
                                ? <>
                                    <div className="flex justify-center items-center gap-2 w-full mb-2">
                                        {
                                            dice.done
                                                ?
                                                <>
                                                    <button ref={rollButtonRef} onClick={() => diceRoll({ id: 'playera' }, 0)} className='text-lg border rounded-md px-4 py-2 w-full'>Roll</button>
                                                    {/* {Array.from({ length: 6 }).map((_, i) => (
                                                    <button onClick={() => diceRoll({ id: 'playera' }, i + 1)} className='border rounded-md px-2 py-1' key={i}> Move {i + 1}</button>
                                                ))} */}
                                                </>
                                                :
                                                <p>{dice.display ? `${dice.turn} rolling ${dice.display}` : `${dice.turn} rolled ${dice.current}`}</p>

                                        }
                                    </div>
                                    <div className='flex gap-2'>
                                        {players.map((player, i) => (
                                            <div className='border p-3' key={i}>
                                                <div className='font-bold'>{player.name}</div>
                                                <div>
                                                    {Object.entries(player).map(([key, value]) => (
                                                        !['type'].includes(key) &&
                                                        <div key={key + value}>
                                                            {`${key}: ${value}`}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                                : <>
                                    {
                                        `${(players.find(player => player.id === (tiles.find(tile => tile.occupants.length) as TTile).occupants[0]) as TPlayer).name} wins!`
                                    }
                                    <button onClick={handleRestart} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}