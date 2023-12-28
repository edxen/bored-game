import React from 'react';

import getData from './hooks/GetData';

import Tiles from './game/Tiles';
import Menu from './game/Menu';
import WinBox from './game/WinBox';
import HandleGame from './logic/HandleGame';
import RollButton from './game/RollButton';
import PlayerUI from './game/PlayerUI';
import TurnUI from './game/TurnUI';
import Header from './game/Header';
import History from './game/History';

export default function Game() {
    const { game, players } = getData();
    HandleGame();

    return (
        <div className='h-[100dvh] flex flex-col p-4 select-none'>
            {!game.started
                ? <>
                    <Header />
                    <Menu />
                </>
                : <>
                    <PlayerUI />
                    <TurnUI />
                    <div className='flex justify-center flex-grow items center flex-1 relative my-2'>
                        <Tiles />
                        <div className={`absolute top-0 left-0 flex flex-col gap-4 h-full w-full justify-center items-center px-24`}>
                            {players.length !== 1
                                ? <RollButton />
                                : <WinBox />
                            }
                        </div>
                    </div>
                    <History />
                </>
            }
        </div >
    );
}