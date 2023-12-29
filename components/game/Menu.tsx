import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PlayerCard from './menu/PlayerCard';

import { setPlayers as setGamePlayers } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { getSameSideColumn } from '../utils/helper';
import { toggleGame, updateGame, updatePhase } from '../reducers/gameReducer';
import { TTile, TPlayer } from '../reducers/initialStates';
import GetData from '../hooks/GetData';
import createPlayer from '../logic/createPlayer';

type TNav = 'menu' | 'start';

export const maxPlayer = Array.from({ length: 4 });


export const getUniquePlayer = (players: TPlayer[]): TPlayer => {
    const isUniquePlayer = (players: TPlayer[], newPlayer: TPlayer): boolean => {
        const isUniqueID = !players.some(player => player.id === newPlayer.id);
        const isUniqueColor = !players.some(player => player.color === newPlayer.color);
        return isUniqueID && isUniqueColor;
    };

    let newPlayer = createPlayer({});
    while (!isUniquePlayer(players, newPlayer)) newPlayer = createPlayer({});
    return newPlayer;
};


const defaultPlayers = (playersLength: number): TPlayer[] => {
    const players: TPlayer[] = [];

    while (players.length < playersLength) {
        const newPlayer = getUniquePlayer(players);
        players.push(newPlayer);
    }

    return players;
};


const Menu = () => {
    const dispatch = useDispatch();
    const [nav, setNav] = useState<TNav>('menu');
    const [players, setPlayers] = useState<TPlayer[]>(defaultPlayers(3));

    const [start, setStart] = useState(false);

    const handleBack = () => {
        setNav('menu');
    };

    const handleStart = () => {
        const setPlayerStartingPoint = () => {
            let availablePath = Array.from({ length: maxPlayer.length }).map((_, i) => getSameSideColumn(i, 1)).sort(() => Math.random() - 0.5);
            setPlayers(prevPlayers => prevPlayers.map((prevPlayer, i) => ({ ...prevPlayer, path: availablePath[i] })));
        };

        if (nav === 'menu') {
            setNav('start');
        } else {
            setPlayerStartingPoint();
            setStart(true);
        }
    };

    useEffect(() => {
        if (start) {
            dispatch(setGamePlayers(players));
            dispatch(toggleGame({ initialize: true }));
            setStart(false);
        }
    }, [start]);  // eslint-disable-line react-hooks/exhaustive-deps

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
                        nav === 'start' && Array.from({ length: players.length + 1 }).map((_, i) => (
                            <PlayerCard key={i} playerState={{ index: i, players, setPlayers }} />
                        ))
                    }
                </div>
            </div>
        </div >
    );
};

export default Menu;