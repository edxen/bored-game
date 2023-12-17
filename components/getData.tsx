import { useSelector } from 'react-redux';
import { RootState } from './reducers';

import { TDice } from './reducers/diceReducer';
import { TPlayer } from "./reducers/playersReducer";
import { TTile } from './reducers/tilesReducer';

const getData = () => {
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const players: TPlayer[] = useSelector((state: RootState) => state.players);
    const tiles: TTile[] = useSelector((state: RootState) => state.tiles);

    const getPlayerData = (id: string) => {
        return players.find(p => p.id === id) as Required<TPlayer>;
    };

    const getPlayerTile = (id: string) => {
        return tiles.find(tile => tile.occupants.includes(id)) as TTile;
    };

    return { dice, players, tiles, getPlayerData, getPlayerTile };
};

export default getData;