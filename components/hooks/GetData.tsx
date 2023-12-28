import { useSelector } from 'react-redux';
import { RootState } from '../reducers';

import { TPlayer, TGame, TDice, TTile } from '../reducers/initialStates';

const GetData = () => {
    const game: TGame = useSelector((state: RootState) => state.game);
    const dice: TDice = useSelector((state: RootState) => state.dice);
    const players: TPlayer[] = useSelector((state: RootState) => state.players);
    const tiles: TTile[] = useSelector((state: RootState) => state.tiles);

    const { history } = game;
    const { queue } = game.round;

    const getPlayer = (id: string) => {
        const data = players.find(p => p.id === id) as Required<TPlayer>;
        const tile = tiles.find(tile => tile.occupants.includes(id)) as TTile;

        return { data, tile };
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

    return { game, queue, history, dice, players, tiles, getPlayer, getPlayerData, getPlayerTile, getTile };
};

export default GetData;