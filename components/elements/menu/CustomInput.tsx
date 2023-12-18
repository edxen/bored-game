import { useEffect, useRef } from 'react';

interface ICustomInputProps {
    props: {
        label: string;
        value: string;
    };
}

const CustomInput = ({ props }: ICustomInputProps) => {
    const { label, value } = props;
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <label className="flex flex-col w-full">
            <span className='select-none'>{label}</span>
            <input ref={inputRef} className='border rounded-md px-4 py-2 bg-white hover:bg-slate-100 focus:bg-slate-100' defaultValue={value} maxLength={3} />
        </label>
    );
};

export default CustomInput;