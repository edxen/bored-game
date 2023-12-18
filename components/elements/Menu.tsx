import { useState } from 'react';

import PlayerCard from './menu/PlayerCard';

import { TPlayer } from '../reducers/playersReducer';

type TNav = 'menu' | 'start';

const Menu = () => {
    const [nav, setNav] = useState<TNav>('menu');

    const defaultPlayer: TPlayer = {
        id: 'player',
        type: 'human',
        name: 'Player',
        path: 1,
        color: 'red'
    };

    const [players, setPlayers] = useState<TPlayer[]>([defaultPlayer]);

    const maxPlayer = 4;
    const countPlayer = Array.from({ length: (players.length + 1 === maxPlayer ? maxPlayer : players.length + 1) });

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
                                    <div className='rounded px-4 py-2 bg-white text-black cursor-pointer'>Start Game</div>
                                </div>
                            </div>
                            <div className='flex gap-4 justify-center items-center'>
                                <div className='flex flex-wrap gap-4 p-4 border rounded-md'>
                                    {
                                        countPlayer.map((_, i) => (
                                            <PlayerCard key={i} displayCard={i == 0 ? true : false} index={i + 1} />
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