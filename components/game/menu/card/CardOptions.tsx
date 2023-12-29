import CustomButton from '../CustomButton';

import { TPlayer } from '@/components/reducers/initialStates';
import { getUniquePlayer, maxPlayer } from '../../../game/Menu';
import { TPlayerState } from '../PlayerCard';

const CardOptions = ({ playerState }: TPlayerState) => {
    const { players, setPlayers } = playerState;

    const newPlayer = getUniquePlayer(players);

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