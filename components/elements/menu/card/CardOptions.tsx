import CustomButton from '../CustomButton';

import { TPlayer } from '@/components/reducers/playersReducer';
import { defaultPlayer, maxPlayer } from '../../Menu';
import { TPlayerState, colorsList, getRemainingColors } from '../PlayerCard';

const CardOptions = ({ playerState }: TPlayerState) => {
    const { players, setPlayers } = playerState;

    const getUnusedColor = (): string => {
        const remainingColors = getRemainingColors(players, colorsList);
        const randomIndex = Math.floor(Math.random() * remainingColors.length);
        return remainingColors[randomIndex];
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
    } as TPlayer;

    newPlayer.name = newPlayer.id.toUpperCase();

    const click = (value: TPlayer['type']) => {
        if (players.length < maxPlayer.length) {
            setPlayers(prevPlayers => [...prevPlayers, { ...newPlayer, type: value }]);
        }
    };

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

export default CardOptions;