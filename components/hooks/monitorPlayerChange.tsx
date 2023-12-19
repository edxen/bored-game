import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TPlayer } from "../reducers/playersReducer";
import { setTurnPlayers } from '../reducers/turnReducer';
import getData from './getData';

const monitorPlayerChange = () => {
    const dispatch = useDispatch();
    const { players } = getData();

    useEffect(() => {
        players.length === 1 && dispatch(setTurnPlayers(players));
    }, [players]);
};

export default monitorPlayerChange;