import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import { updatePhase } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { setDice } from '../reducers/diceReducer';
import config from '../configuration';
import { TPlayerAction, playerAction } from '../reducers/initialStates';
import { setPlayer } from '../reducers/playersReducer';

const RollButton = () => {
    const dispatch = useDispatch();
    const { game, dice, getPlayerData } = GetData();
    const { phase, queue } = game.round;
    const player = getPlayerData(queue[0]);

    const handleRoll = () => {
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const handleForceRoll = (force: number) => {
        dispatch(setDice({ force }));
        setExactMenuDisplay(false);

        if (phase === 'extra') start('exact');
        else dispatch(updatePhase({ phase: 'roll' }));
    };

    const [exactMenuDisplay, setExactMenuDisplay] = useState<boolean>(false);

    const start = (key: keyof TPlayerAction) => {
        dispatch(setPlayer({ id: player.id, extra: false, action: { ...player.action, [key]: false } }));
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const handleExtra = (key: string) => {
        switch (key) {
            case 'exact':
                setExactMenuDisplay(true);
                break;
            case 'high':
                dispatch(setDice({ min: 4, max: 3 }));
                start(key);
                break;
            case 'low':
                dispatch(setDice({ min: 1, max: 3 }));
                start(key);
                break;
            case 'extra':
                dispatch(updatePhase({ phase: 'roll' }));
                start(key);
                break;
            case 'cancel': dispatch(updatePhase({ phase: 'end' })); break;
        }
    };

    const buttonClass = `flex flex-col gap-2 justify-center items-center bg-white transition-all x-5 p-4 border rounded-2xl w-full shadow-md hover:bg-slate-100 hover:border-x-2 hover:font-semibold whitespace-nowrap`;

    return (
        <>
            {phase === 'pre' ?
                <div className="flex flex-col gap-2 w-full ">
                    <button className={`${buttonClass} animate-bounce`} onClick={handleRoll}>
                        Roll Dice
                    </button>
                    {
                        config.enableSpecificDice && (
                            <div className="flex gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <button key={i} className={buttonClass} onClick={() => handleForceRoll(i + 1)}> Roll {i + 1} </button>
                                ))}
                            </div>
                        )
                    }
                </div>
                : phase === 'extra'
                    ?
                    !exactMenuDisplay ?
                        <div className='flex flex-col gap-2 w-full'>
                            <div className="flex gap-2 justify-items-center place-items-center">
                                {Object.entries(player.action).map(([key, value]) =>
                                    value && key !== 'dodge' && (
                                        <div key={key} className="flex flex-grow">
                                            <button className={buttonClass} onClick={() => handleExtra(key)}>
                                                Use {playerAction[key as keyof TPlayerAction]}
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                            <button className={buttonClass} onClick={() => handleExtra('cancel')}>
                                Cancel
                            </button>
                        </div>
                        :
                        <div className="flex gap-2">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <button key={i} className={buttonClass} onClick={() => handleForceRoll(i + 1)}> Roll {i + 1} </button>
                            ))}
                        </div>
                    :

                    dice.display && (
                        <button className={buttonClass}>
                            <span className="font-semibold">
                                {getPlayerData(queue[0]).name}
                            </span>
                            {
                                ((dice.display.indexOf('Rolling') !== -1 || dice.display.indexOf('Rolled') !== -1) && phase !== 'xaction')
                                    ?
                                    dice.display.replace('Rolled ', '').replace('Rolling ', '').length === 1 &&
                                    <div className="flex flex-col items-center justify-center gap-4">
                                        <div>
                                            {dice.display.replace('Rolling ', '').length === 1 && 'Rolling'}
                                            {dice.display.replace('Rolled ', '').length === 1 && 'Rolled'}
                                        </div>
                                        <Image src={`/images/dice/dice-${dice.display.replace('Rolled ', '').replace('Rolling ', '')}.png`} alt="dice" width="40" height="40" className={`${dice.display.indexOf('Rolling') !== -1 ? 'animate-bounce' : ''} transition-transform`} />
                                    </div>
                                    : <span>{dice.display}</span>
                            }
                        </button>
                    )

            }
        </>
    );
};

export default RollButton;