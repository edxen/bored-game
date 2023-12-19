import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTurnPlayers } from '../reducers/turnReducer';
import { TPlayer } from '../reducers/playersReducer';
import { TTile, setTile } from '../reducers/tilesReducer';
import getData from './getData';

const initialize = () => {
    const dispatch = useDispatch();
    const { players, tiles } = getData();

    const addPlayersToBoard = (players: TPlayer[]) => {
        const addPlayerToTile = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTile({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };
        players.map((player) => addPlayerToTile(player));
    };

    const initializeTurnDisplay = (players: TPlayer[]) => {
        dispatch(setTurnPlayers(players));
    };

    useEffect(() => {
        addPlayersToBoard(players);
        initializeTurnDisplay(players);
    }, []);
};

export default initialize;