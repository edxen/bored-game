import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';
import { TPlayerState, colorsList } from '../PlayerCard';

const CardDetails = ({ playerState }: TPlayerState) => {
    const { index, id, players, setPlayers } = playerState;

    const name = {
        label: 'Name (Max 3 Characters)',
        playerState,
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