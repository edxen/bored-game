import { useDispatch } from 'react-redux';
import CustomButton from '../CustomButton';
import { setPlayers } from '@/components/reducers/playersReducer';
import { setPlayer } from '@/components/reducers/playersReducer';
import { TPlayer, getUniquePlayer } from '@/components/logic/createPlayer';
import GetData from '@/components/hooks/GetData';
import { maxPlayers } from '../../Menu';

const CardOptions = () => {
    const dispatch = useDispatch();
    const { players } = GetData();

    const click = (value: TPlayer['type']) => {
        if (players.length < maxPlayers.length) {
            const newPlayer = getUniquePlayer(players);
            dispatch(setPlayers([...players, newPlayer]));
            dispatch(setPlayer({ id: newPlayer.id, type: value }));
        }
    };

    const addHuman = { label: 'Add Human', click: () => click('human') };
    const addComputer = { label: 'Add Computer', click: () => click('computer') };

    return (
        <>
            {[addHuman, addComputer].map((prop, i) => <CustomButton key={i} props={prop} />)}
        </>
    );
};

export default CardOptions;