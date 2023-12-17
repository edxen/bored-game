import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { TTile, TPlayer } from '@/components/interface';
import { TDice } from './reducers/diceReducer';
import setElementOnFocus from './setElementOnFocus';
import Tile from './tile';

import { useDispatch, useSelector } from 'react-redux';
import { setDisplay, setCurrent, setDone, setTurn } from './reducers/diceReducer';
import { RootState } from './reducers';

const generateTiles = (columns: number, rows: number): TTile[] => {
    return Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const isEdge = row === 0 || row === rows - 1 || column === 0 || column === columns - 1;

        const getPath = (): number => {
            if (row === 0) {
                return column + 1;
            } else if (column === columns - 1 && row !== rows - 1) {
                return columns + row;
            } else if (row === rows - 1 && column !== 0) {
                return columns * 2 + (columns - column) - 2;
            } else if (column === 0) {
                return (columns * 3) + (rows - row) - 3;
            }
            return 0;
        };

        return {
            index,
            type: 'plain',
            occupants: [],
            edge: isEdge,
            path: isEdge ? getPath() : 0
        };
    });
};

const AddPlayers = (players: TPlayer[], setTiles: React.Dispatch<React.SetStateAction<TTile[]>>) => {
    useEffect(() => {
        setTiles((prevTiles: TTile[]) => {
            const addPlayer = (player: TPlayer) => {
                const tileIndex = prevTiles.findIndex((tile) => tile.path === player.path);
                if (!prevTiles[tileIndex].occupants.includes(player.id)) {
                    prevTiles[tileIndex].occupants.push(player.id);
                }
            };
            players.map((player) => addPlayer(player));

            return [...prevTiles];
        });
    }, [setTiles]); // eslint-disable-line react-hooks/exhaustive-deps
};

const initialPlayers: TPlayer[] = [
    { id: 'playera', type: 'human', name: 'P1', path: 1, color: 'bg-red-700' },
    { id: 'playerb', type: 'ai', name: 'A1', path: 19, color: 'bg-blue-700' }
];

export default function Game() {
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const dispatch = useDispatch();

    const [tiles, setTiles] = useState<TTile[]>(generateTiles(10, 10));
    const [players, setPlayers] = useState<TPlayer[]>(initialPlayers);
    const rollButtonRef = useRef<HTMLButtonElement>(null);

    AddPlayers(players, setTiles);

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
                        // if next path is already occupied, replace occupant with only the active player
                        if (currentTile.occupants.length > 1) {
                            const currentPlayer = players.find(_player => _player.id === player.id) as Required<TPlayer>;
                            if (currentPlayer.last_path + currentPlayer.roll === currentPlayer.path) {
                                // get all occupants except active player
                                const filteredPlayers = currentTile.occupants.filter(id => id !== player.id);
                                // remove occupying player from players state
                                setPlayers(prevPlayers => prevPlayers.filter(player => !filteredPlayers.includes(player.id)));
                                //replace occupant only with active player
                                setTiles(prevTiles => (prevTiles[currentTile.index].occupants = [player.id], [...prevTiles]));
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

    useEffect(() => {
        if (players.length > 1 && dice.turn === 'ai') {
            diceRoll({ id: 'playerb' }, 0);
        }
    }, [dice.turn]); // eslint-disable-line react-hooks/exhaustive-deps

    setElementOnFocus({ condition: dice.done, elementRef: rollButtonRef });

    const playerMove = (player: Pick<TPlayer, 'id'>) => {
        const currentTile = tiles.find(tile => tile.occupants.includes(player.id)) as TTile;
        if (currentTile.index !== -1) {
            const maxPathLength = tiles.filter(tile => tile.edge === true).length;
            const nextTile = tiles.find(tile => tile.path === (currentTile.path + 1 <= maxPathLength ? currentTile.path + 1 : 1)) as TTile;
            if (nextTile.index !== -1) {
                setTiles(prevTiles => {
                    const movePlayerToNextTile = () => {
                        const tile = (tile: Pick<TTile, 'index'>) => prevTiles[tile.index];
                        if (!tile(nextTile).occupants.includes(player.id)) {
                            tile(nextTile).occupants.push(player.id);
                            tile(currentTile).occupants = tile(currentTile).occupants.filter(id => id !== player.id);
                        }
                    };
                    movePlayerToNextTile();
                    return [...prevTiles];
                });

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
                                                        ['type', 'path'].includes(key) &&
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