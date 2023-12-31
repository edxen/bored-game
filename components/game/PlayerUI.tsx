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
                            <div className="flex gap-1 flex-wrap">
                                <div className="flex flex-grow items-center gap-2 px-2 bg-white rounded-lg ">
                                    <Image src={`/images/icons/icon-${player.type}.png`} alt={player.type} width="20" height="20" className="object-contain h-auto w-auto" />
                                    <div className="text-lg font-semibold">{player.name}</div>
                                </div>
                                <div className="flex flex-col flex-grow gap-1 w-full">
                                    <div className='flex flex-grow bg-white rounded-lg flex-nowrap h-6 w-full'>
                                        <Image src='/images/icons/icon-knife.png' alt="dice" width="20" height="20" className='rotate-45 h-auto w-auto' />
                                        <div className="flex flex-grow justify-around items-center">
                                            {player.killed.length > 0 &&
                                                player.killed.map((id: string, i, arr) => (
                                                    <div key={id} className={`${getPlayerData(id).color} flex flex-grow items-center font-medium h-full px-2 ${i == arr.length - 1 ? 'rounded-e-lg' : ''}`}>
                                                        {getPlayerData(id).name}
                                                    </div>
                                                ))

                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className='flex bg-white p-1 rounded-lg flex-nowrap h-6 w-full'>
                                            <Image src='/images/icons/icon-flag.png' alt="dice" width="20" height="20" className='object-contain h-auto w-auto' />
                                            <div className="flex flex-grow justify-evenly gap-0.5">
                                                {!player.dead && player.flags.map((color: string) => (
                                                    <div key={color} className={`${color} flex font-medium p-1.5 rounded-full`}>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className='flex bg-white p-1 rounded-lg flex-nowrap h-6 w-full'>
                                            <Image src='/images/icons/icon-dice.png' alt="dice" width="20" height="20" className='object-contain h-auto w-auto' />
                                            <div className="flex flex-grow justify-evenly gap-0.5">
                                                {!player.dead && player.actions && Object.entries(player.actions).map(([key, value]) => value && (
                                                    <Image key={key} src={`/images/dice/dice-${playerActions[key as keyof TPlayerActions].replace(' ', '-').toLowerCase()}.png`} alt="dice" width="20" height="20" className='h-auto w-auto object-contain' />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {player.dead &&
                            <div className="absolute top-0 left-0 h-full w-full p-2 flex justify-center">
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