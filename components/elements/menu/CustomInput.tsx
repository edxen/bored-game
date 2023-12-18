import React, { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';
import { TPlayerState } from './PlayerCard';

interface ICustomInputProps {
    props: {
        label: string;
        value: string;
        playerState: TPlayerState['playerState'];
    };
}

const CustomInput = ({ props }: ICustomInputProps) => {
    const { label, value, playerState } = props;
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
    }, [value]);

    return (
        <label className="flex flex-col w-full">
            <span className='select-none'>{label}</span>
            <input className='border rounded-md px-4 py-2 bg-white hover:bg-slate-100 focus:bg-slate-100' value={inputValue} onChange={handleInputChange} maxLength={3} />
        </label>
    );
};

export default CustomInput;