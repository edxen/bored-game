import { useRouter } from 'next/router';

import { TTile } from '@/components/interface';
import Tile from './tile';

import { TPlayer } from './reducers/playersReducer';
import RollDiceButton from './rollDiceButton';
import getData from './getData';
import addPlayers from './addPlayer';

export default function Game() {
    const { players, tiles } = getData();

    addPlayers();

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
                                        <RollDiceButton />
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