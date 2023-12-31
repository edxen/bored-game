import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import GetData from "../hooks/GetData";
import HandleRound from "./HandleRound";
import { toggleGame, updateGame, updatePhase, updateQueuePlayers, updateRoundCounter } from "../reducers/gameReducer";
import { setTile } from "../reducers/tilesReducer";
import { TDice, TGame, TTile } from "../reducers/initialStates";
import { UnknownAction } from 'redux';
import config from '../configuration';
import { TPlayer, bgColors } from "./createPlayer";
import { setPlayer } from "../reducers/playersReducer";
import { maxPlayers } from "../game/Menu";
import { getRemainingColorsList } from "../game/menu/card/CardDetails";
import { getSameSideColumn } from "../utils/helper";

export type THandleGameProps = {
    dispatch: React.Dispatch<UnknownAction>;
    game: TGame;
    players: TPlayer[];
    tiles: TTile[];
    dice: TDice;
};

const HandleInitialize = ({ dispatch, game, players, tiles }: Omit<THandleGameProps, 'dice'>) => {

    const setTileFlagsColor = (currentPlayers: string[], tileFlags: string[]) => {
        const addPlayerToTile = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTile({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };

        const switchTileFlags = () => {
            const tileFlagTemp = tileFlags[3];
            tileFlags[3] = tileFlags[2];
            tileFlags[2] = tileFlagTemp;
        };

        const getRemainingFlagColors = () => {
            if (players.length < maxPlayers.length) {
                let count = maxPlayers.length - players.length;
                let list = getRemainingColorsList(players);
                outer: while (count > 0) {
                    const newColor = list[Math.floor(Math.random() * list.length)];
                    for (let i = 0; i < tileFlags.length; i++) {
                        if (tileFlags[i].indexOf('bg-') === -1) {
                            tileFlags[i] = bgColors[newColor];
                            break;
                        }
                    }
                    list = list.filter(item => item !== newColor);
                    count--;
                }
            }
        };

        players.map((player) => {
            dispatch(setPlayer({ id: player.id, starting_path: player.path }));
            for (let i = 0; i < tileFlags.length; i++) {
                const strPath = player.path.toString();
                if (tileFlags[i] === strPath) {
                    tileFlags[i] = player.color;
                }
            }
            currentPlayers.push(player.id);
            addPlayerToTile(player);
            dispatch(setPlayer({ id: player.id, flags: [player.color] }));
        });

        switchTileFlags();
        getRemainingFlagColors();

        const flagPaths = tiles.filter(tile => tile.type === 'flag');
        flagPaths.forEach((flagPath, i) => {
            dispatch(setTile({ index: flagPath.index, key: 'flag', value: tileFlags[i] }));
        });
    };

    const updatePlayers = () => {
        const currentPlayers = [] as string[];
        let tileFlags: string[] = Array.from({ length: maxPlayers.length }).map((_, i) => getSameSideColumn(i, 1).toString());

        setTileFlagsColor(currentPlayers, tileFlags);
        dispatch(updateQueuePlayers(currentPlayers));
        dispatch(toggleGame({ started: true }));
        dispatch(updateGame({ target: 'history', value: ['Game started'] }));
    };

    const initialRender = useRef(true);

    useEffect(() => {
        if (!initialRender.current && game.initialize && !game.started) {
            dispatch(updatePhase({ phase: 'change' }));
            updatePlayers();
        } else {
            initialRender.current = false;
        }
    }, [game.initialize, game.started]); // eslint-disable-line react-hooks/exhaustive-deps
};

const HandleGame = () => {
    const dispatch = useDispatch();
    const { game, players, tiles, dice } = GetData();
    if (config.customPlayer.enabled) dispatch(toggleGame({ initialize: true }));

    HandleInitialize({ dispatch, game, players, tiles });
    HandleRound({ dispatch, game, players, tiles, dice });
};

export default HandleGame;