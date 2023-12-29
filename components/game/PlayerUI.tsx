import React from "react";
import Image from "next/image";

import GetData from "@/components/hooks/GetData";
import { TPlayerActions, playerActions } from "@/components/reducers/initialStates";

const PlayerUI = () => {
    const { queue, players } = GetData();

    return (
        <div className="flex justify-around items-flex-start gap-2 px-2 border-b-2 pb-2 mb-2 min-h-[80px]">
            {
                players.map((player, i: number) => (
                    <div key={i} className={`flex gap-2 ${player.color} flex-grow-0 ${queue[0] === player.id ? 'border-4 border-red-400' : 'border-4 border-slate-200'} rounded-xl p-2 select-none`}>
                        <div className="flex flex-col gap-1 text-xs flex-wrap">
                            <div className="flex gap-2 flex-wrap">
                                <div className="flex bg-white rounded-lg px-2 items-center gap-2">
                                    <Image src={`/images/icons/icon-${player.type}.png`} alt={player.type} width="20" height="20" className="object-contain h-auto w-auto" />
                                    <div className="text-lg font-semibold">{player.name}</div>
                                </div>
                                <div className="flex flex-col items-start gap-1 flex-wrap">
                                    {
                                        [{ label: 'Flags', value: [] }, { label: 'Eliminated', value: [] }].map((item, i) => (
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
                                    player.actions && Object.entries(player.actions).map(([key, value]) => value && (
                                        <Image key={key} src={`/images/dice/dice-${playerActions[key as keyof TPlayerActions].replace(' ', '-').toLowerCase()}.png`} alt="dice" width="20" height="20" className='' />
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};

export default PlayerUI;