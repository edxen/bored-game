interface ICustomButtonProps {
    props: {
        label: string;
        click: () => void;
    };
}

const CustomButton = ({ props }: ICustomButtonProps) => {
    const { label, click } = props;

    return (
        <button onClick={click} className='w-full px-4 py-2 border rounded-md bg-white hover:bg-slate-100'>{label}</button>
    );
};

export default CustomButton;