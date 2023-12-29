import CustomButton from '../CustomButton';

import { TPlayer } from '@/components/reducers/initialStates';
import { maxPlayer } from '../../../game/Menu';
import { TPlayerState } from '../PlayerCard';
import createPlayer from '@/components/logic/createPlayer';

const CardOptions = ({ playerState }: TPlayerState) => {
    const { players, setPlayers } = playerState;

    const newPlayer = createPlayer({});

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