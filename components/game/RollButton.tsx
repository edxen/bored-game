import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Image from 'next/image';

import { updateGame, updatePhase } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { setDice } from '../reducers/diceReducer';
import config from '../configuration';
import { setPlayer } from '../reducers/playersReducer';
import { TPlayerActions, playerActions } from '../logic/createPlayer';

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

        if (phase === 'pre') dispatch(updatePhase({ phase: 'roll' }));
        else start('exact');
    };

    const [exactMenuDisplay, setExactMenuDisplay] = useState<boolean>(false);

    const start = (key: keyof TPlayerActions) => {
        dispatch(setPlayer({ id: player.id, extra: false, actions: { ...player.actions, [key]: false } }));
        dispatch(updateGame({ target: 'history', value: [`Extra Action: ${player.name} used ${playerActions[key]}`] }));
        dispatch(setDice({ current: '' }));
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
            case 'cancel':
                dispatch(updatePhase({ phase: 'end' }));
                dispatch(updateGame({ target: 'history', value: [`${player.name} skipped extra action`] }));
                break;
        }
    };

    const buttonClass = `flex flex-col gap-2 justify-center items-center bg-white transition-all x-5 p-4 border rounded-2xl shadow-md hover:bg-slate-100 hover:border-x-2 hover:font-semibold whitespace-nowrap`;
    const actionClass = `flex flex-row gap-1 justify-center items-center bg-white transition-all x-5 p-4 border rounded-2xl shadow-md hover:bg-slate-100 hover:border-x-2 hover:font-semibold whitespace-nowrap`;

    return (
        <>
            {
                phase === 'change'
                    ? <button className={actionClass}>
                        <span className="font-medium">{`${player.name}'s Turn ${player.skip ? '(Skipped)' : ''}`}</span>
                    </button>
                    : phase === 'pre' ?
                        <div className="flex flex-col gap-2 ">
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
                            ? !exactMenuDisplay ?
                                <div className='flex flex-col gap-2'>
                                    <div className="flex gap-2 justify-center items-center flex-wrap">
                                        {Object.entries(player.actions).map(([key, value]) =>
                                            value === true && (
                                                <div key={key} className="flex flex-grow max-w-[140px]">
                                                    <button className={actionClass} onClick={() => handleExtra(key)}>
                                                        <Image src={`/images/dice/dice-${playerActions[key as keyof TPlayerActions].replace(' ', '-').toLowerCase()}.png`} alt={`${key} dice`} width="20" height="20" className='' />
                                                        <span>Use</span>
                                                        <span>{playerActions[key as keyof TPlayerActions]}</span>
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
                            : dice.display && dice.current && (
                                <button className={buttonClass}>
                                    <span className="font-semibold">
                                        {getPlayerData(queue[0]).name}
                                    </span>
                                    {
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div>
                                                {dice.display}
                                            </div>
                                            <Image src={`/images/dice/dice-${dice.current}.png`} alt="dice" width="40" height="40" className={`${dice.display === 'Rolling' ? 'animate-bounce' : ''} transition-transform`} />
                                            {phase === 'xaction' && (
                                                <div>
                                                    {dice.current.toString().replace('-', ' ')}
                                                </div>
                                            )}
                                        </div>
                                    }
                                </button>
                            )
            }
        </>
    );
};

export default RollButton;