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
    const [nav, setNav] = useState<TNav>('menu');

    const [players, setPlayers] = useState<TPlayer[]>(
        [
            defaultPlayer({ name: 'PL1', type: 'human', color: 'red' }),
            defaultPlayer({ name: 'AI1', type: 'computer', color: 'blue' })
        ]
    );

    const maxPlayer = Array.from({ length: 4 });

    return (
        <>
            {/* <button onClick={() => setNav('menu')} className='fixed left-0 top-0 rounded-md border px-4 py-2'>Reset</button> */}
            <div className='w-full flex flex-col justify-center items-center'>
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <div className={
                        `
                        
                        transition-all delay-250
                        ${nav === 'start'
                            ? 'w-full p-4 mb-2 border rounded-md bg-black text-white'
                            : 'w-0'
                        }
                    `
                    }>
                        <div className='w-full flex justify-center items-center font-bold'>
                            <div className={
                                `
                            transition-all delay-250
                            ${nav === 'start'
                                    ? 'visible opacity-100 px-4 py-2 flex-grow'
                                    : 'invisible opacity-0 w-0'
                                }
                            `
                            }>Players</div>
                            {
                                players.length > 1 &&
                                <div className='px-4 py-2 bg-white text-black border rounded-md hover:bg-slate-100 cursor-pointer  whitespace-nowrap'
                                    onClick={() => setNav('start')}>Start Game</div>
                            }
                        </div>
                    </div>
                    <div className={
                        `
                        flex justify-center items-center gap-4 w-full
                        transition-height delay-500 duration-500 
                        ${nav === 'start'
                            ? 'visible opacity-100 h-full'
                            : 'invisible opacity-0 h-0'
                        }
                    `
                    }>
                        <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border rounded-md'>
                            {
                                maxPlayer.map((_, i) => (
                                    <PlayerCard key={i} playerState={{ index: i, players, setPlayers }} />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default Menu;;;