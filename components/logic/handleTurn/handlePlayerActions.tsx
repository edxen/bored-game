import { THandleTurnProps } from "../HandleTurn";
import gameReducer, { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { TGame, TTile } from "@/components/reducers/initialStates";
import { setPlayer } from "@/components/reducers/playersReducer";
import { setTile } from "@/components/reducers/tilesReducer";
import { getSameSideColumn } from "@/components/utils/helper";
import config from "@/components/configuration";

const HandlePlayerActions = ({ dispatch, game, player, tiles, getTile }: Omit<THandleTurnProps, 'dice'> & { game: TGame, tiles: TTile[]; }) => {
    let currentPath = player.path;
    const getCurrentTile = () => getTile({ path: currentPath });

    const endSequence = () => {
        dispatch(updatePhase({ phase: 'post' }));
    };

    const isFlag = () => {
        const currentTile = getCurrentTile();
        if (currentTile.type === 'flag') {
            dispatch(setPlayer({ id: player.id, flags: [...player.flags, currentTile.flag] }));
            dispatch(updateGame({ target: 'history', value: [`${player.name} landed on flag zone, ${currentTile.flag.replace(/^bg-(\w+)-\d+$/, '$1')} flag collected`] }));
        }
    };

    const isSkip = () => {
        const currentTile = getCurrentTile();
        if (currentTile.type === 'stop') {
            dispatch(setPlayer({ id: player.id, skip: true }));
            dispatch(updateGame({ target: 'history', value: [`${player.name} landed on stop zone, this and next turn is cancelled`] }));
        }
    };

    const isOccupied = () => {
        const currentTile = getTile({ path: currentPath });
        if (currentTile.type !== 'safe' && currentTile.occupants.length) {
            const removeOccupants = () => {
                currentTile.occupants.forEach(occupant => {
                    dispatch(setPlayer({ id: occupant, dead: true }));
                    dispatch(setPlayer({ id: player.id, killed: [...player.killed, occupant] }));
                });
                dispatch(setTile({ index: currentTile.index, key: 'occupants', value: [player.id] }));
            };
            removeOccupants();
            dispatch(updateGame({ target: 'history', value: [`${player.name} landed on an occupied tile`] }));
        } else if (currentTile.type === 'safe') {
            dispatch(updateGame({ target: 'history', value: [`${player.name} landed on safe zone, no elimination allowed`] }));
        }
    };

    const isPortal = () => {
        const currentTile = getTile({ path: currentPath });
        if (currentTile.type === 'portal') {
            const getPortalPath = (index: number) => getSameSideColumn(index, 6);
            const warpTo = (portalPath: number) => {
                const warpPath = getTile({ path: getPortalPath(portalPath) }).path;
                dispatch(updateGame({ target: 'history', value: [`${player.name} landed on portal, warping to portal at path: ${warpPath}`] }));
                moveToNextTile(warpPath, currentPath);
            };

            switch (currentTile.path) {
                case getPortalPath(0): warpTo(2); break;
                case getPortalPath(1): warpTo(3); break;
                case getPortalPath(2): warpTo(0); break;
                case getPortalPath(3): warpTo(1); break;
            }
        }
    };

    const moveToNextTile = (targetPath: number, prevPath?: number) => {
        const updateTileOccupants = (index: number, occupants: string[]) => dispatch(setTile({ index, key: 'occupants', value: occupants }));

        const totalPaths = tiles.filter(tile => tile.edge === true).length;

        let nextPath = targetPath + (prevPath ? 0 : 1);
        if (nextPath > totalPaths) {
            nextPath = 1;
            prevPath = totalPaths;
        }

        const lastTile = getTile({ path: prevPath ? prevPath : (nextPath - 1) });
        const nextTile = getTile({ path: nextPath });

        updateTileOccupants(nextTile.index, [player.id, ...nextTile.occupants]);
        updateTileOccupants(lastTile.index, lastTile.occupants.filter(id => id !== player.id));

        currentPath = nextTile.path;
        dispatch(setPlayer({ id: player.id, index: nextTile.index, path: nextTile.path, last_path: lastTile.path }));
    };

    const actionSequence = () => {
        isPortal();
        isOccupied();
        isSkip();
        isFlag();
        endSequence();
    };

    let moveCounter = 0;
    const actionInterval = setInterval(() => {
        if (moveCounter !== player.roll) {
            moveToNextTile(currentPath);
            moveCounter++;
        } else {
            clearInterval(actionInterval);
            actionSequence();
        }
    }, config.moveSpeed || 150);

    actionInterval;
};

export default HandlePlayerActions;