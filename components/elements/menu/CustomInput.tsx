interface ICustomInputProps {
    props: {
        label: string;
        value: string;
    };
}

const CustomInput = ({ props }: ICustomInputProps) => {
    const { label, value } = props;

    return (
        <label className="flex flex-col w-full">
            <span className='select-none'>{label}</span>
            <input className='border rounded-md px-4 py-2 hover:bg-slate-300 focus:bg-slate-300' defaultValue={value} />
        </label>
    );
};

export default CustomInput;