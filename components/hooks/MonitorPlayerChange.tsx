import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setTurnPlayers } from '../reducers/turnReducer';
import GetData from './GetData';

const MonitorPlayerChange = () => {
    const dispatch = useDispatch();
    const { players } = GetData();

    useEffect(() => {
        players.length === 1 && dispatch(setTurnPlayers(players));
    }, [players]);  // eslint-disable-line react-hooks/exhaustive-deps
};

export default MonitorPlayerChange;