import React, { Fragment } from 'react';
import Image from 'next/image';

import { TTile } from "@/components/reducers/initialStates";
import GetData from "@/components/hooks/GetData";

const GenerateOccupants = ({ occupants, playerClass }: { occupants: TTile['occupants'], playerClass: (occupants: string) => string; }) => {
    const { queue, getPlayerData } = GetData();

    const renderOccupants = (occupants: string[]) => {
        return occupants.map(occupant => {
            const player = getPlayerData(occupant);
            if (player) {
                return (
                    <Fragment key={player.id}>
                        <div key={player.id} className={playerClass(occupant)}>
                            <span className="font-medium">{player.name}</span>
                        </div>
                        {player.id === queue[0] &&
                            <div className="absolute top-0 left-0 mt-[-40px] flex w-full justify-center items-center z-20">
                                <Image src='/images/icons/icon-arrow-down.png' alt="active player" width="30" height="30" className='opacity-70 animate-bounce' />
                            </div>
                        }
                    </Fragment>
                );
            }
        });
    };

    return (
        <>
            {renderOccupants(occupants)}
        </>
    );
};

export default GenerateOccupants;