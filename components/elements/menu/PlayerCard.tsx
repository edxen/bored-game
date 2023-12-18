import { useState } from 'react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { defaultPlayer } from '../Menu';

import { TPlayer } from '@/components/reducers/playersReducer';

interface IPlayerCardProps {
    index: number;
    setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>,
    displayCard?: boolean,
}

const PlayerCard = ({ index, setPlayers, displayCard }: IPlayerCardProps) => {
    const [display, setDisplay] = useState(displayCard);

    const name = {
        label: 'Name',
        value: 'Player ' + index
    };
    const colors = {
        label: 'Color',
        list: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Violet', 'Brown', 'Black']
    };
    const type = {
        label: 'Type',
        list: ['Human', 'AI']
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
        const newPlayer: TPlayer = {
            ...defaultPlayer,
            id: 'player' + index,
            name: `Player ${index}`,
        };

        const addHuman = {
            label: 'Add Human',
            click: () => {
                setDisplay(true);
                setPlayers(prevPlayers =>
                    [
                        ...prevPlayers,
                        { ...newPlayer, type: 'human' }
                    ]
                );
            }
        };

        const addComputer = {
            label: 'Add Computer',
            click: () => {
                setDisplay(true);
                setPlayers(prevPlayers =>
                    [
                        ...prevPlayers,
                        { ...newPlayer, type: 'ai' }
                    ]
                );
            }
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