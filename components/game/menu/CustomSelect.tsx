import React, { useState, useEffect, useRef } from 'react';
import { TCardProps, getRemainingColorsList } from './card/CardDetails';
import { setPlayer } from '@/components/reducers/playersReducer';
import { bgColors } from '@/components/logic/createPlayer';

const toCapitalize = (str: string): string => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
};

const CustomSelect = ({ props }: TCardProps) => {
    const { label, list, value, state } = props;
    const { dispatch, player, players } = state;

    const [items, setItems] = useState<string[]>(list ?? []);
    const [display, setDisplay] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLInputElement>(null);

    const [inputValue, setInputValue] = useState<string>(value);

    useEffect(() => {
        if (value !== inputValue) {
            setInputValue(value);
        }
    }, [value, inputValue]);

    const showOptions = () => {
        setDisplay(true);
        if (label.toLowerCase() === 'color') {
            setItems(getRemainingColorsList(players));
        }
    };

    const optionSelect = (selectedItem: string) => {
        const target = label.toLowerCase();
        const update = { [target]: target === 'color' ? bgColors[selectedItem] : selectedItem };

        dispatch(setPlayer({ id: player.id, ...update }));
        if (inputRef.current) inputRef.current.value = toCapitalize(selectedItem);
        setDisplay(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                if (inputRef.current) setDisplay(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex flex-col w-full">
            <span className='font-semibold'>{label}</span>
            <div className='relative cursor-pointer'>
                <div onClick={showOptions} className='flex justify-between border rounded-md ps-4 pe-2 py-2 cursor-pointer bg-white hover:bg-slate-100'>
                    <input ref={inputRef} className='cursor-pointer bg-transparent outline-none' value={toCapitalize(inputValue)} readOnly={true} />
                    <CaretDown />
                </div>
                <div ref={optionsRef} className={`${!display ? 'hidden' : ''} absolute top-0 left-0 w-full bg-white border rounded-md z-10`}>
                    {
                        items && items.map((item, i) => (
                            <div key={i} onClick={() => optionSelect(item)} className='rounded-md px-4 py-2 select-none hover:text-black hover:bg-slate-100 transition-all'>{toCapitalize(item)}</div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomSelect;

const CaretDown = ({ size = 20 }: Partial<{ size: number; }>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
};