import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PlayerCard from './menu/PlayerCard';

import { setPlayer, setPlayers } from '../reducers/playersReducer';
import { getSameSideColumn } from '../utils/helper';
import { toggleGame } from '../reducers/gameReducer';
import defaultPlayers from '../logic/createPlayer';
import GetData from '../hooks/GetData';
import config from '../configuration';

export const maxPlayers = Array.from({ length: 4 });

const Menu = () => {
    const dispatch = useDispatch();
    const { players } = GetData();
    const [nav, setNav] = useState<'menu' | 'start'>('menu');

    const InitializeMenu = () => {
        useEffect(() => {
            if (!config.customPlayer.enabled) {
                dispatch(setPlayers(defaultPlayers(2)));
            }
        }, []); // eslint-disable-line react-hooks/exhaustive-deps
    };

    InitializeMenu();


    const handleBack = () => {
        setNav('menu');
    };

    const handleStart = () => {
        const setPlayerStartingPoint = () => {
            let availablePath = Array.from({ length: maxPlayers.length }).map((_, i) => getSameSideColumn(i, 1)).sort(() => Math.random() - 0.5);
            players.forEach((player, i) => {
                dispatch((setPlayer({ id: player.id, path: availablePath[i] })));
            });
        };

        if (nav === 'menu') {
            setNav('start');
        } else {
            setPlayerStartingPoint();
            dispatch(toggleGame({ initialize: true }));
        }
    };

    const buttonClass = 'px-4 py-2 bg-white text-black font-bold border rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap';
    const startButtonClass = (nav === 'start' && players.length < 2) ? 'hidden' : '';

    return (
        <div className={`flex flex-col justify-center items-center ${nav === 'menu' ? 'h-full' : ''}`}>
            <div className={`transition-all delay-250 ${nav === 'start' ? 'w-full p-4 mb-2 border rounded-md bg-black text-white' : 'w-0'}`}>
                <div className='flex justify-center items-center w-full gap-2'>
                    <div className={`transition-all delay-250 font-bold ${nav === 'start' ? 'visible opacity-100 px-4 py-2 flex-grow' : 'invisible opacity-0 w-0'}`}>Players</div>
                    {
                        nav === 'start' &&
                        <div className={buttonClass} onClick={handleBack}>Back</div>
                    }
                    <div className={`${buttonClass} ${startButtonClass}`} onClick={handleStart}>Start Game</div>
                </div>
            </div>
            <div className={`flex justify-center items-flex-start w-full gap-4 transition-height duration-500 ${nav === 'start' ? 'delay-150 visible opacity-100 h-full' : 'delay-0 invisible opacity-0 h-0'}`}>
                <div className={`w-full grid grid-cols-1 sm:grid-cols-2 justify-center items-start gap-4 p-4 border rounded-md transition-height duration-500 ${nav === 'start' ? 'delay-150 visible scale-y-100 origin-top' : 'delay-0 invisible opacity-0 scale-y-0'}`}>
                    {
                        nav === 'start' && <PlayerCard />
                    }
                </div>
            </div>
        </div >
    );
};

export default Menu;