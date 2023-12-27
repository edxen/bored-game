import React from 'react';
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import GetData from "../hooks/GetData";
import HandleRound from "./HandleRound";
import { toggleGame, updatePhase, updateQueuePlayers, updateRoundCounter } from "../reducers/gameReducer";
import { setTile } from "../reducers/tilesReducer";
import { TDice, TGame, TPlayer, TTile } from "../reducers/initialStates";
import { UnknownAction } from 'redux';
import config from '../configuration';

export type THandleGameProps = {
    dispatch: React.Dispatch<UnknownAction>;
    game: TGame;
    players: TPlayer[];
    tiles: TTile[];
    dice: TDice;
};

const HandleInitialize = ({ dispatch, game, players, tiles }: Omit<THandleGameProps, 'dice'>) => {

    const updatePlayers = () => {
        const addPlayerToTile = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTile({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };
        const currentPlayers = [] as string[];
        players.map((player) => {
            currentPlayers.push(player.id);
            addPlayerToTile(player);
        });
        dispatch(updateQueuePlayers(currentPlayers));
        dispatch(toggleGame({ started: true }));
    };

    const initialRender = useRef(true);

    useEffect(() => {
        if (!initialRender.current && !game.started) {
            dispatch(updatePhase({ phase: 'pre' }));
            updatePlayers();
        } else {
            initialRender.current = false;
        }
    }, [game.started]);  // eslint-disable-line react-hooks/exhaustive-deps
};

const HandleGame = () => {
    const dispatch = useDispatch();
    const { game, players, tiles, dice } = GetData();

    if (config.customPlayer.enabled) dispatch(toggleGame({ initialize: true }));

    if (game.initialize) HandleInitialize({ dispatch, game, players, tiles });
    HandleRound({ dispatch, game, players, tiles, dice });
};

export default HandleGame;