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

const PlayerCard = ({ index, playerState }: IPlayerCardProps) => {
    const { players, setPlayers } = playerState;

    const id = players[index]?.id;

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
        click: () => {
            setPlayers(prevPlayers => prevPlayers.filter(prevPlayer => prevPlayer.id !== id));
        }
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

        const getUnusedID = (): string => {
            const getRandomLetter = () => String.fromCharCode(Math.floor(Math.random() * 26) + 97);

            const usedIds = new Set(players.map(player => player.id));
            let newId;

            do {
                newId = Array.from({ length: 3 }, getRandomLetter).join('');
            } while (usedIds.has(newId));

            return newId;
        };

        const newPlayer: TPlayer = {
            ...defaultPlayer,
            id: getUnusedID(),
            color: getUnusedColor()
        };
        newPlayer.name = newPlayer.id.toUpperCase();

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