import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

import { TDice } from '../reducers/diceReducer';
import { TPlayer } from "../reducers/playersReducer";
import { TTile } from '../reducers/tilesReducer';
import { TTurnState } from '../reducers/turnReducer';

const GetData = () => {
    const turns: TTurnState = useSelector((state: RootState) => state.turns);
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const players: TPlayer[] = useSelector((state: RootState) => state.players);
    const tiles: TTile[] = useSelector((state: RootState) => state.tiles);

    const getTurns = () => {
        return turns;
    };

    const getPlayerData = (id: string) => {
        return players.find(p => p.id === id) as Required<TPlayer>;
    };

    const getPlayerTile = (id: string) => {
        return tiles.find(tile => tile.occupants.includes(id)) as TTile;
    };

    const getTile = ({ path }: Pick<TTile, 'path'>) => {
        const found = tiles.find(tile => tile.path === path);
        if (!found) {
            throw new Error(`tile with path ${path} not found`);
        }
        return found as TTile;
    };

    return { turns, dice, players, tiles, getPlayerData, getPlayerTile, getTile };
};

export default GetData;