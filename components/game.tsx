import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import Tile from './elements/tile';
import RollDiceButton from './elements/rollDiceButton';
import getData from './hooks/getData';
import page from './hooks/reloadPage';
import { setTurn } from './reducers/turnReducer';
import { TPlayer } from './reducers/playersReducer';
import initialize from './hooks/initialize';

const monitorEndTurn = (players: TPlayer[]) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (players.length === 1) {
            dispatch(setTurn(players));
        }
    }, [players]);
};

export default function Game() {
    const { turns, players, tiles } = getData();
    const { refresh } = page();

    initialize();

    const handleRestart = () => {
        refresh();
    };

    monitorEndTurn(players);

    return (
        <div className='p-4'>
            <div className='flex justify-center items-center gap-2 my-2'>
                <div className='font-bold'>Turns:</div>
                {turns.map((player: TPlayer, i) => (
                    <div className='flex gap-2' key={player.id}>
                        <div>{'>>'}</div>
                        <div className={i === 0 ? `${player} font-bold underline` : ''}>{player.name}</div>
                    </div>
                ))}
            </div>
            <div className='relative grid my-2'>
                <div className="h-full w-full grid gap-4 grid-cols-10 justify-center items-center">
                    {
                        tiles.map((e, i) => (
                            <Tile
                                key={i}
                                players={players}
                                edge={e.edge}
                                type={e.type}
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
                                        <RollDiceButton />
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
                                        `${players[0].name} wins!`
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