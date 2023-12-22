import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import GetData from './GetData';
import { updateGame } from '../reducers/gameReducer';

const MonitorPlayerChange = () => {
    const dispatch = useDispatch();
    const { players } = GetData();

    useEffect(() => {
        players.length === 1 && dispatch(updateGame({ target: 'queue', value: players.map((player => player.id)) }));
    }, [players]);  // eslint-disable-line react-hooks/exhaustive-deps
};

export default MonitorPlayerChange;