import React, { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { TPlayerState } from './PlayerCard';

interface ICustomInputProps {
    props: {
        label: string;
        subLabel: string;
        value: string;
        playerState: TPlayerState['playerState'];
    };
}

const CustomInput = ({ props }: ICustomInputProps) => {
    const { label, subLabel, value, playerState } = props;
    const { id, setPlayers } = playerState;
    const [inputValue, setInputValue] = useState<string>(value);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setPlayers((prevPlayers) =>
            prevPlayers.map((prevPlayer) =>
                prevPlayer.id === id ? { ...prevPlayer, name: e.target.value } : prevPlayer
            )
        );
    };

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value, inputValue]);

    return (
        <label className="flex flex-col w-full">
            <div className="flex gap-1 items-center">
                <span className="font-semibold">{label}</span>
                <span className="font-medium text-xs">( {subLabel} )</span>
            </div>
            <input className='border rounded-md px-4 py-2 bg-white hover:bg-slate-100 focus:bg-slate-100' value={inputValue} onChange={handleInputChange} maxLength={3} />
        </label>
    );
};

export default CustomInput;