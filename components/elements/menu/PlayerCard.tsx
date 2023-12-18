import { useState } from 'react';

import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { defaultPlayer } from '../Menu';

import { TPlayer } from '@/components/reducers/playersReducer';

interface IPlayerCardProps {
    index: number;
    playerState: {
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
    displayCard?: boolean,
}

const PlayerCard = ({ index, playerState, displayCard }: IPlayerCardProps) => {
    const [display, setDisplay] = useState(displayCard);
    const { players, setPlayers } = playerState;

    const name = {
        label: 'Name',
        value: players[index]?.name
    };
    const colors = {
        label: 'Color',
        list: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Violet', 'Brown', 'Black'],
        value: players[index]?.color
    };
    const type = {
        label: 'Type',
        list: ['Human', 'Computer'],
        value: players[index]?.type
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
        const getUnusedColor = (): string => {
            const usedColors = players.map(player => player.color);
            const remainingColors = colors.list.filter(color => !usedColors.includes(color));
            const randomIndex = Math.floor(Math.random() * remainingColors.length);
            return remainingColors[randomIndex].toLowerCase();
        };

        const newPlayer: TPlayer = {
            ...defaultPlayer,
            id: 'player' + (index + 1),
            name: `Player ${index + 1}`,
            color: getUnusedColor()
        };

        const click = (value: TPlayer['type']) => setPlayers(prevPlayers => [...prevPlayers, { ...newPlayer, type: value }]);

        const addHuman = {
            label: 'Add Human',
            click: () => click('human')
        };

        const addComputer = {
            label: 'Add Computer',
            click: () => click('computer')
        };

        return (
            <>
                {[addHuman, addComputer].map((prop, i) => <CustomButton key={i} props={prop} />)}
            </>
        );
    };

    return (
        <div className='flex flex-col flex-1 gap-4 p-4 justify-center items-center border rounded-md'>
            {players[index] ? <Card /> : <Options />}
        </div>
    );
};

export default PlayerCard;