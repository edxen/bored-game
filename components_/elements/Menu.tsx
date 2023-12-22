import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import PlayerCard, { TColorsList, bgColors } from './menu/PlayerCard';

import { setPlayers as setGamePlayers } from '../reducers/playersReducer';
import { setTile } from '../reducers/tilesReducer';
import { getSameSideColumn } from '../utils/helper';
import { updateGame } from '../reducers/gameReducer';
import { TTile, TPlayer } from '../reducers/initialStates';
import GetData from '../hooks/GetData';

type TNav = 'menu' | 'start';


interface TDefaultPlayer extends Pick<TPlayer, 'name' | 'type'> {
    color: TColorsList;
}

export const defaultPlayer = ({ name, type, color }: TDefaultPlayer): TPlayer => {
    const player: TPlayer = { name, type, color, id: name.toLowerCase(), path: 1 };
    return player;
};

export const maxPlayer = Array.from({ length: 4 });

const Menu = () => {
    const dispatch = useDispatch();
    const [nav, setNav] = useState<TNav>('menu');
    const [players, setPlayers] = useState<TPlayer[]>(
        [
            defaultPlayer({ name: 'PL1', type: 'human', color: 'red' }),
            defaultPlayer({ name: 'AI1', type: 'computer', color: 'blue' })
        ]
    );

    const [start, setStart] = useState(false);

    const handleStart = () => {
        if (nav === 'menu') {
            setNav('start');
        } else {

            let availablePath = Array.from({ length: 4 }).map((_, i) => getSameSideColumn(i, 1)).sort(() => Math.random() - 0.5);
            setPlayers(prevPlayers => (
                prevPlayers.map((prevPlayer, i) => (
                    {
                        ...prevPlayer,
                        path: availablePath[i],
                        color: bgColors[prevPlayer.color]
                    }
                ))
            ));
            setStart(true);
        }
    };

    const { tiles } = GetData();

    const addPlayersToBoard = (players: TPlayer[]) => {
        const addPlayerToTile = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTile({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };
        players.map((player) => addPlayerToTile(player));
    };

    const initializeTurnDisplay = (players: TPlayer[]) => {
        const getPlayerIds = players.map((player) => player.id);
        dispatch(updateGame({ target: 'queue', value: getPlayerIds }));
    };

    useEffect(() => {
        if (start) {
            dispatch(setGamePlayers(players));
            addPlayersToBoard(players);
            initializeTurnDisplay(players);
            setStart(false);
        }
    }, [start]);  // eslint-disable-line react-hooks/exhaustive-deps

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
                            <div className='px-4 py-2 bg-white text-black font-bold border rounded-md hover:bg-slate-100 cursor-pointer whitespace-nowrap' onClick={handleStart}>Start Game</div>
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