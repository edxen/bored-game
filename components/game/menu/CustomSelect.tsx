import React, { useState, useEffect, useRef } from 'react';
import { TPlayerState, getRemainingColors } from './PlayerCard';
import { bgColors } from '@/components/logic/createPlayer';

interface ICustomSelectProps {
    props: {
        label: string;
        list: string[];
        value: string;
        playerState: TPlayerState['playerState'];
    };
}

const CaretDown = ({ size = 20 }: Partial<{ size: number; }>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width={size} height={size}
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        >
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
};

const toCapitalize = (str: string): string => {
    const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
    return capitalized;
};

const CustomSelect = ({ props }: ICustomSelectProps) => {
    const { label, list, value, playerState } = props;
    const { id, players, setPlayers } = playerState;

    const [items, setItems] = useState<string[]>(list);
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
            setItems(getRemainingColors(players, list));
        }
    };

    const optionSelect = (selectedItem: string) => {
        if (inputRef.current) inputRef.current.value = toCapitalize(selectedItem);
        setDisplay(false);
        setPlayers(prevPlayers =>
            prevPlayers.map(prevPlayer => {
                if (prevPlayer.id === id) {
                    return {
                        ...prevPlayer,
                        [label.toLowerCase()]: label.toLowerCase() === 'color' ? bgColors[selectedItem] : selectedItem
                    };
                }
                return prevPlayer;
            })
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                if (inputRef.current) setDisplay(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-col w-full">
            <span className='select-none'>{label}</span>
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