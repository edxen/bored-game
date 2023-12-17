import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { TPlayer } from "../reducers/playersReducer";
import { setTurn } from '../reducers/turnReducer';
import getData from './getData';

const monitorPlayerChange = () => {
    const dispatch = useDispatch();
    const { players } = getData();

    useEffect(() => {
        players.length === 1 && dispatch(setTurn(players));
    }, [players]);
};

export default monitorPlayerChange;