import { useState } from 'react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';

const PlayerCard = ({ displayCard, index }: Partial<{ displayCard: boolean; index: number; }>) => {
    const [display, setDisplay] = useState(displayCard);

    const name = {
        label: 'Name',
        value: 'Player ' + index
    };
    const colors = {
        label: 'Color',
        list: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Teal', 'Brown', 'Black']
    };
    const type = {
        label: 'Type',
        list: ['Human', 'Computer']
    };

    const removePlayer = {
        label: 'Remove Player',
        click: () => { setDisplay(false); }
    };

    const Card = () => {
        return (
            <>
                <CustomInput props={name} />
                <CustomSelect props={colors} />
                <CustomSelect props={type} />
                <CustomButton props={removePlayer} />
            </>
        );
    };

    const Options = () => {
        const click = () => { setDisplay(true); };


        const addHuman = {
            label: 'Add Human',
            click
        };

        const addComputer = {
            label: 'Add Computer',
            click
        };

        return (
            <>
                {[addHuman, addComputer].map((prop, i) => <CustomButton key={i} props={prop} />)}
            </>
        );
    };

    return (
        <div className='flex flex-col flex-1 gap-4 p-4 justify-center items-center border rounded-md'>
            {display ? <Card /> : <Options />}
        </div>
    );
};

export default PlayerCard;