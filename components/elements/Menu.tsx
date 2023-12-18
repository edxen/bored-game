import { useState } from 'react';

import PlayerCard, { colorsList } from './menu/PlayerCard';

import { TPlayer } from '../reducers/playersReducer';

type TNav = 'menu' | 'start';

type TColors = typeof colorsList[number] extends infer C ? C extends string ? C : never : never;

interface TDefaultPlayer extends Pick<TPlayer, 'name' | 'type'> {
    color: TColors;
}

export const defaultPlayer = ({ name, type, color }: TDefaultPlayer): TPlayer => {
    const player: TPlayer = { name, type, color, id: name.toLowerCase(), path: 1 };
    return player;
};

const Menu = () => {
    const [nav, setNav] = useState<TNav>('start');

    const [players, setPlayers] = useState<TPlayer[]>(
        [
            defaultPlayer({ name: 'PL1', type: 'human', color: 'red' }),
            defaultPlayer({ name: 'AI1', type: 'computer', color: 'blue' })
        ]
    );

    const maxPlayer = 4;
    const countPlayer = Array.from({ length: (players.length + 1 > maxPlayer ? maxPlayer : players.length + 1) });

    return (
        <div className='flex flex-col justify-center items-center'>
            {
                nav === 'menu'
                    ? <button onClick={() => setNav('start')} className='px-4 py-2 border rounded-md'>Start Game</button>
                    : nav === 'start' ?
                        <div className='flex flex-col justify-center items-center'>
                            <div className='w-full p-4 mb-2 border rounded-md bg-black text-white'>
                                <div className='flex justify-between items-center font-bold'>
                                    <div>Players</div>
                                    {
                                        players.length > 1 &&
                                        <div className='rounded px-4 py-2 bg-white text-black hover:bg-slate-100 cursor-pointer'>Start Game</div>
                                    }
                                </div>
                            </div>
                            <div className='flex gap-4 justify-center items-center'>
                                <div className='flex flex-wrap gap-4 p-4 border rounded-md'>
                                    {
                                        countPlayer.map((_, i) => (
                                            <PlayerCard key={i} playerState={{ index: i, players, setPlayers }} />
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                        : ''
            }
        </div >
    );
};

export default Menu;