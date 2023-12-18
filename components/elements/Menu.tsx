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

export const maxPlayer = Array.from({ length: 4 });

const Menu = () => {
    const [nav, setNav] = useState<TNav>('menu');

    const [players, setPlayers] = useState<TPlayer[]>(
        [
            defaultPlayer({ name: 'PL1', type: 'human', color: 'red' }),
            defaultPlayer({ name: 'AI1', type: 'computer', color: 'blue' })
        ]
    );

    const flexCenter = 'flex justify-center items-center';
    const flexColCenter = `${flexCenter} flex-col`;

    return (
        <div className={`${flexColCenter} w-full`}>
            <div className={`${flexColCenter} h-full w-full`}>
                <div className={`transition-all delay-250 ${nav === 'start' ? 'w-full p-4 mb-2 border rounded-md bg-black text-white' : 'w-0'}`}>
                    <div className={`${flexCenter} w-full`}>
                        <div className={`transition-all delay-250 font-bold ${nav === 'start' ? 'visible opacity-100 px-4 py-2 flex-grow' : 'invisible opacity-0 w-0'}`}>Players</div>
                        {
                            players.length > 1 &&
                            <div className='px-4 py-2 bg-white text-black font-bold border rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap' onClick={() => setNav(nav === 'menu' ? 'start' : 'menu')}>Start Game</div>
                        }
                    </div>
                </div>
                <div className={`${flexCenter} w-full gap-4 transition-height duration-500 ${nav === 'start' ? 'delay-150 visible opacity-100 h-full' : 'delay-0 invisible opacity-0 h-0'}`}>
                    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 justify-center items-center gap-4 p-4 border rounded-mdtransition-height duration-500 ${nav === 'start' ? 'delay-150 visible scale-y-100 origin-top' : 'delay-0 invisible opacity-0 scale-y-0'}`}>
                        {
                            Array.from({ length: players.length + 1 }).map((_, i) => (
                                <PlayerCard key={i} playerState={{ index: i, players, setPlayers }} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >
    );
};

export default Menu;