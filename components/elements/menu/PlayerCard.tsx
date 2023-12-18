import CustomSelect from './CustomSelect';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import { defaultPlayer } from '../Menu';

import { TPlayer } from '@/components/reducers/playersReducer';

export type IPlayerCardProps = {
    playerState: {
        id?: string;
        index: number;
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
};

export const colorsList = ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'Pink', 'Violet'] as const;

export const getRemainingColors = (players: TPlayer[], colors: string[]): string[] => {
    const usedColors = players.map(player => player.color);
    const remainingColors = colors.filter(color => !usedColors.includes(color.toLowerCase()));
    return remainingColors;
};

const PlayerCard = ({ playerState }: IPlayerCardProps) => {
    const { index, players, setPlayers } = playerState;
    const id = players[index]?.id;
    playerState.id = id;

    const name = {
        label: 'Name (Max 3 Characters)',
        value: players[index]?.name
    };
    const colors = {
        label: 'Color',
        list: colorsList,
        playerState,
        value: players[index]?.color
    };
    const type = {
        label: 'Type',
        list: ['Human', 'Computer'],
        playerState,
        value: players[index]?.type
    };

    const removePlayer = {
        label: 'Remove Player',
        click: () => {
            setPlayers(prevPlayers => prevPlayers.filter(prevPlayer => prevPlayer.id !== id));
        }
    };

    const CardClass = 'flex flex-col flex-1 gap-4 p-4 justify-center items-center border rounded-md';
    const bgColor = {
        red: 'bg-red-300',
        blue: 'bg-blue-300',
        green: 'bg-green-300',
        yellow: 'bg-yellow-300',
        orange: 'bg-orange-300',
        purple: 'bg-purple-300',
        pink: 'bg-pink-300',
        violet: 'bg-violet-300',
        brown: 'bg-brown-300',
        black: 'bg-black-300',
    };

    const selectedColor = players[index]?.color?.toLowerCase() || '';
    const bgClass = bgColor[selectedColor as keyof typeof bgColor];

    const Card = () => {
        return (
            <div className={`${CardClass} ${bgClass}`}>
                <CustomInput props={name} />
                <CustomSelect props={colors} />
                <CustomSelect props={type} />
                <CustomButton props={removePlayer} />
            </div>
        );
    };


    const Options = () => {
        const getUnusedColor = (): string => {
            const remainingColors = getRemainingColors(players, colors.list);
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
            <div className={`${CardClass} bg-slate-100`}>
                {[addHuman, addComputer].map((prop, i) => <CustomButton key={i} props={prop} />)}
            </div>
        );
    };

    return (
        <>
            {players[index] ? <Card /> : <Options />}
        </>
    );
};

export default PlayerCard;