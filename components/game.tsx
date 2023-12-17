import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { TTile, TPlayer } from '@/components/interface';
import { TDice } from './reducers/diceReducer';
import setElementOnFocus from './setElementOnFocus';
import Tile from './tile';

import { useDispatch, useSelector } from 'react-redux';
import { setDisplay, setCurrent, setDone, setTurn } from './reducers/diceReducer';
import { setTileProps } from './reducers/tilesReducer';
import { RootState } from './reducers';

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

const initialPlayers: TPlayer[] = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'ai', name: 'A1', path: 19, color: 'bg-blue-700' }
];

export default function Game() {
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const tiles: TTile[] = useSelector((state: RootState) => state.tiles);
    const dispatch = useDispatch();

    const [players, setPlayers] = useState<TPlayer[]>(initialPlayers);
    const rollButtonRef = useRef<HTMLButtonElement>(null);

    AddPlayers(players, tiles, setTileProps);

    const diceRoll = (player: Pick<TPlayer, 'id'>, force: number) => {
        const randomize = () => Math.floor(Math.random() * 6) + 1;
        const rollResult = force ? force : randomize();
        let count = force ? 10 : 0;

        dispatch(setDone(false));

        const displayInterval = setInterval(() => {
            if (count === 10) {
                clearInterval(displayInterval);
                dispatch(setDisplay(0));
                dispatch(setCurrent(rollResult));

                setPlayers(prevPlayers => {
                    const currentPlayer = prevPlayers.find(prevPlayer => prevPlayer.id === player.id) as TPlayer;
                    currentPlayer.last_path = currentPlayer.path;
                    currentPlayer.roll = rollResult;
                    return [...prevPlayers];
                });

                const moveInterval = setInterval(() => {
                    const currentPlayer = players.find(_player => _player.id === player.id) as Required<TPlayer>;
                    if (currentPlayer.last_path + currentPlayer.roll === currentPlayer.path) {
                        dispatch(setDone(true));
                        dispatch(setTurn(dice.turn === 'human' ? 'ai' : 'human'));

                        clearInterval(moveInterval);
                        const currentTile = tiles.find(tile => tile.occupants.includes(player.id)) as TTile;
                        if (currentTile.occupants.length > 1) {
                            const currentPlayer = players.find(_player => _player.id === player.id) as Required<TPlayer>;
                            if (currentPlayer.last_path + currentPlayer.roll === currentPlayer.path) {
                                const filteredPlayers = currentTile.occupants.filter(id => id !== player.id);
                                setPlayers(prevPlayers => prevPlayers.filter(player => !filteredPlayers.includes(player.id)));
                                dispatch(setTileProps({ index: currentTile.index, key: 'occupants', value: [player.id] }));
                            }
                        }
                    } else {
                        playerMove(player);
                    }
                }, 200);
            } else {
                dispatch(setDisplay(randomize()));
                count++;
            }
        }, 100 * 1);
    };

    const playerMove = (player: Pick<TPlayer, 'id'>) => {
        const currentTile = tiles.find(tile => tile.occupants.includes(player.id)) as TTile;
        if (currentTile.index !== -1) {
            const maxPathLength = tiles.filter(tile => tile.edge === true).length;
            const nextTile = tiles.find(tile => tile.path === (currentTile.path + 1 <= maxPathLength ? currentTile.path + 1 : 1)) as TTile;
            if (nextTile.index !== -1) {
                const movePlayerToNextTile = () => {
                    const tile = (tile: Pick<TTile, 'index'>) => tiles[tile.index];
                    if (!tile(nextTile).occupants.includes(player.id)) {
                        let updatedOccupants = [...tile(nextTile).occupants];
                        updatedOccupants.push(player.id);
                        dispatch(setTileProps({ index: nextTile.index, key: 'occupants', value: updatedOccupants }));

                        updatedOccupants = tile(currentTile).occupants.filter(id => id !== player.id);
                        dispatch(setTileProps({ index: currentTile.index, key: 'occupants', value: updatedOccupants }));
                    }
                };
                movePlayerToNextTile();

                setPlayers(prevPlayers => {
                    let getPlayer = prevPlayers.find(prevPlayer => prevPlayer.id === player.id) as Required<TPlayer>;
                    const resetPlayerPathOnEnd = () => {
                        if (getPlayer.last_path + getPlayer.roll > maxPathLength) {
                            let remainingRoll = getPlayer.roll - (maxPathLength - getPlayer.last_path);
                            getPlayer.last_path = 0;
                            getPlayer.roll = remainingRoll > 0 ? remainingRoll : 0;
                        }
                    };

                    getPlayer.index = nextTile.index;
                    getPlayer.path = nextTile.path;
                    resetPlayerPathOnEnd();
                    return [...prevPlayers];
                });
            } else {
                console.error(`${nextTile.path} not found`);
            }
        } else {
            console.error(`${player.id} not found`);
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