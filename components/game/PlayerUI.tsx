import React from "react";
import Image from "next/image";

import GetData from "@/components/hooks/GetData";
import { TPlayerActions, playerActions } from "../logic/createPlayer";

const PlayerUI = () => {
    const { queue, players, getPlayerData } = GetData();

    return (
        <div className="flex justify-around items-flex-start gap-2 px-2 border-b-2 pb-2 mb-2 min-h-[80px]">
            {
                players.map((player, i: number) => (
                    <div key={i} className={`relative flex gap-2 ${player.color} flex-grow-0 ${queue[0] === player.id ? 'border-4 border-red-400' : 'border-4 border-slate-200'} ${player.dead ? 'opacity-50' : ''} rounded-xl p-2 select-none`}>
                        <div className="flex flex-col gap-1 text-xs flex-wrap">
                            <div className="flex gap-2 flex-wrap">
                                <div className="flex bg-white rounded-lg px-2 items-center gap-2">
                                    <Image src={`/images/icons/icon-${player.type}.png`} alt={player.type} width="20" height="20" className="object-contain h-auto w-auto" />
                                    <div className="text-lg font-semibold">{player.name}</div>
                                </div>
                                <div className="flex items-start">
                                    <div className='flex bg-white rounded-lg flex-nowrap w-full'>
                                        <Image src='/images/icons/icon-knife.png' alt="dice" width="20" height="20" className='rotate-45' />
                                        <div className="flex">
                                            {player.killed.length
                                                ? player.killed.map((id: string, i, arr) => (
                                                    <div key={id} className={`${getPlayerData(id).color} flex bg-opacity-50 font-medium h-full px-1`}>
                                                        {getPlayerData(id).name}
                                                        {i !== arr.length - 1 ? ',' : ''}
                                                    </div>
                                                ))
                                                :
                                                <div className='font-medium h-full px-1'>
                                                    Empty
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 ">
                                {
                                    player.actions && Object.entries(player.actions).map(([key, value]) => value && (
                                        <Image key={key} src={`/images/dice/dice-${playerActions[key as keyof TPlayerActions].replace(' ', '-').toLowerCase()}.png`} alt="dice" width="20" height="20" className='' />
                                    ))
                                }
                            </div>
                        </div>
                        {player.dead &&
                            <div className="absolute top-0 left-0 h-full w-full flex justify-center">
                                <Image src='/images/icons/icon-knife.png' alt="dead icon" width="125" height="125" className='pixelated h-auto w-auto rotate-45 z-10' />
                            </div>
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default PlayerUI;