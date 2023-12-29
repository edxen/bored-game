import React, { ChangeEvent, useEffect, useState } from 'react';
import { TCardProps } from './card/CardDetails';
import { setPlayer } from '@/components/reducers/playersReducer';

const CustomInput = ({ props }: TCardProps) => {
    const { label, subLabel, value, state } = props;
    const { dispatch, player } = state;

    const [inputValue, setInputValue] = useState<string>(value);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setInputValue(name);
        dispatch(setPlayer({ id: player.id, name }));
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