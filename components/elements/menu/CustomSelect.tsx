import { TPlayer } from '@/components/reducers/playersReducer';
import { useState, useEffect, useRef } from 'react';

interface ICustomSelectProps {
    props: {
        label: string;
        list: string[];
        value: string;
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

const CustomSelect = ({ props }: ICustomSelectProps) => {
    const { label, list, value } = props;
    const [items, setItems] = useState<string[]>(list);
    const [display, setDisplay] = useState<boolean>(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLInputElement>(null);

    const showOptions = () => {
        setDisplay(true);
    };

    const optionSelect = (selectedItem: string) => {
        setDisplay(false);
        if (inputRef.current) inputRef.current.value = selectedItem;
    };

    const getValueFromItems = () => {
        return items.filter(item => item.toLowerCase() === value);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                if (inputRef.current) optionSelect(inputRef.current.value);
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
                <div onClick={showOptions} className='flex justify-between border rounded-md ps-4 pe-2 py-2 cursor-pointer hover:bg-slate-300'>
                    <input ref={inputRef} className='cursor-pointer bg-transparent outline-none' defaultValue={getValueFromItems()} readOnly={true} />
                    <CaretDown />
                </div>
                <div ref={optionsRef} className={`${!display ? 'hidden' : ''} absolute top-0 left-0 w-full bg-white border rounded-md z-10`}>
                    {
                        items && items.map((item, i) => (
                            <div key={i} onClick={() => optionSelect(item)} className='rounded-md px-4 py-2 select-none hover:text-black hover:bg-slate-300 transition-all'>{item}</div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default CustomSelect;