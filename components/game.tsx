import React from 'react';
import Image from 'next/image';

import getData from './hooks/GetData';

import Turns from './elements/Turns';
import Tiles from './elements/Tiles';
import Menu from './elements/Menu';
import PlayerInformation from './elements/PlayerInformation';
import WinBox from './elements/WinBox';
import HandleGame from './logic/HandleGame';
import RollButton from './elements/RollButton';
import config from './configuration';
import { TPlayerAction, playerAction } from './reducers/initialStates';

export default function Game() {
    const { game, players, getPlayerData, getTile } = getData();
    const { round } = game;
    const { queue } = round;
    HandleGame();

    return (
        <div className='h-[100dvh] flex flex-col p-4'>
            {!game.started &&
                <div className='w-full flex flex-col justify-center items-center my-5 text-sm text-gray-700 font-bold'>
                    <h1 className='text-2xl text-black rotate-6'>Bored Game</h1>
                    <h4 className='m-[-.50rem]'>by</h4>
                    <h4 className='-rotate-3'>Edxen the Bored Developer</h4>
                </div>
            }
            {
                queue.length !== 0 && (
                    <>
                        <div className="flex justify-between items-flex-start gap-2 px-2 border-b-2 pb-2 mb-2 min-h-[110px]">
                            {
                                players.map((player, i: number) => (
                                    <div key={i} className={`flex gap-2 ${player.color} flex-grow-0 ${queue[0] === player.id ? 'border-4 border-red-400' : 'border border-slate-200'} rounded-xl p-2 select-none`}>
                                        <div className="flex flex-col gap-1 text-xs flex-wrap">
                                            <div className="flex gap-2 flex-wrap">
                                                <div className="flex bg-white rounded-lg px-2 items-center gap-2">
                                                    <Image src={`/images/icons/icon-${player.type}.png`} alt={player.type} width="20" height="20" className="object-contain" />
                                                    <div className="text-lg font-semibold">{player.name}</div>
                                                </div>
                                                <div className="flex flex-col items-start gap-1 flex-wrap">
                                                    {
                                                        [{ label: 'Flags', value: ['Blue', 'Red'] }, { label: 'Eliminated', value: ['JSXA', 'SIAM'] }].map((item, i) => (
                                                            <div key={i} className="flex gap-1 flex-wrap">
                                                                <div className="font-medium">{item.label}:</div>
                                                                <div>{item.value.map((id, _i, arr) => <span key={id}>{id}{_i !== (arr.length - 1) && ','} </span>)}</div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-2 ">
                                                {
                                                    player.action && Object.entries(player.action).map(([key, value]) => value && (
                                                        <div key={key} className="bg-white rounded-xl px-2 p-1 whitespace-nowrap">{playerAction[key as keyof TPlayerAction]}</div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-center">
                            <div className="font-bold">
                                Round {round.count} Turn {round.turn}
                            </div>
                            <div className="flex gap-2">
                                {
                                    queue.map((id, i) => (
                                        <div key={i} className="flex justify-center items-center gap-2">
                                            <div className={`${getPlayerData(id).color} relative flex justify-center gap-2 ${getPlayerData(id).skip ? 'opacity-50' : ''} items-center px-2 rounded-lg text-sm font-medium`}>
                                                <div>
                                                    {getPlayerData(id).name}
                                                </div>

                                                <Image src={`/images/icons/icon-${getTile({ path: getPlayerData(id).path }).type}.png`} alt={id} width="14" height="14" className="bg-slate-200 rounded-full" />
                                            </div>
                                            {i !== queue.length - 1 && (
                                                <Image src="/images/icons/icon-arrow-left.png" alt={id} width="10" height="10" />
                                            )}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </>
                )
            }
            <div className='flex justify-center items center flex-1 relative my-2'>
                {
                    !game.started
                        ?
                        <div className="h-full w-full flex flex-col justify-center items-center px">
                            <Menu />
                        </div>
                        :
                        <>
                            <Tiles />
                            <div className={`absolute top-0 left-0 flex flex-col gap-4 h-full w-full justify-center items-center px-24`}>
                                {players.length !== 1 ?
                                    (
                                        <div className="flex justify-center item-center size-full select-none">
                                            <RollButton />
                                        </div>
                                    )
                                    :
                                    (
                                        <WinBox />
                                    )
                                }
                            </div>
                        </>
                }
            </div>
        </div >
    );
}

const ControlBox = () => {
    return (
        <>
            <div className="flex justify-center items-center gap-2 w-full mb-2">
                <RollButton />
            </div>
            <div className='flex gap-2'>
                <PlayerInformation />
            </div>
        </>
    );
};