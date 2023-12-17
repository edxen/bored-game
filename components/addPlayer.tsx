import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import getData from './getData';
import { setTileProps } from './reducers/tilesReducer';
import { TPlayer } from './reducers/playersReducer';
import { TTile } from './interface';

const addPlayers = () => {
    const { tiles, players } = getData();

    const dispatch = useDispatch();

    useEffect(() => {
        const addPlayer = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTileProps({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };
        players.map((player) => addPlayer(player));
    }, []);
};

export default addPlayers;