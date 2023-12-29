import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import { TPlayerState } from '../PlayerCard';
import { TPlayer } from '@/components/reducers/initialStates';
import { colorsList } from '@/components/logic/createPlayer';

export const getRemainingColorsList = (players: TPlayer[]) => {
    const usedColors = [] as string[];
    const remainingColors = [] as string[];

    players.forEach(player => {
        const readableColor = player.color.replace(/^bg-(\w+)-\d+$/, '$1');
        usedColors.push(readableColor);
    });

    colorsList.forEach(colors => {
        if (!usedColors.includes(colors)) {
            remainingColors.push(colors);
        }
    });

    return remainingColors;
};

const CardDetails = ({ playerState }: TPlayerState) => {
    const { index, id, players, setPlayers } = playerState;

    const name = {
        label: 'Name',
        subLabel: "Max 3 Characters",
        playerState,
        value: players[index]?.name
    };
    const colors = {
        label: 'Color',
        list: getRemainingColorsList(players),
        playerState,
        value: players[index]?.color.replace(/^bg-(\w+)-\d+$/, '$1')
    };
    const type = {
        label: 'Type',
        list: ['human', 'computer'],
        playerState,
        value: players[index]?.type
    };

    const removePlayer = {
        label: 'Remove Player',
        click: () => {
            setPlayers(prevPlayers => prevPlayers.filter(prevPlayer => prevPlayer.id !== id));
        }
    };

    return (
        <>
            <CustomInput props={name} />
            <CustomSelect props={colors} />
            <CustomSelect props={type} />
            <CustomButton props={removePlayer} />
        </>
    );
};

export default CardDetails;