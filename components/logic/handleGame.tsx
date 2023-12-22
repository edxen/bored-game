import React from 'react';
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import GetData from "../hooks/GetData";
import handleRound from "./handleRound";
import { toggleGame, updateQueuePlayers, updateRoundCounter } from "../reducers/gameReducer";
import { setTile } from "../reducers/tilesReducer";
import { TDice, TGame, TPlayer, TTile } from "../reducers/initialStates";
import { UnknownAction } from 'redux';

export type THandleGameProps = {
    dispatch: React.Dispatch<UnknownAction>;
    game: TGame;
    players: TPlayer[];
    tiles: TTile[];
    dice: TDice;
};

const handleInitialize = ({ dispatch, game, players, tiles }: Omit<THandleGameProps, 'dice'>) => {
    // console.log('initialize game');

    const updatePlayers = () => {
        const addPlayerToTile = (player: TPlayer) => {
            const tile = tiles.find((tile) => tile.path === player.path) as TTile;
            if (!tile.occupants.includes(player.id)) {
                const updatedOccupants = [...tile.occupants, player.id];
                dispatch(setTile({ index: tile.index, key: 'occupants', value: updatedOccupants }));
            }
        };

        players.map((player) => addPlayerToTile(player));
        dispatch(updateQueuePlayers(players));
        dispatch(toggleGame({ started: true }));
    };

    const initialRender = useRef(true);
    useEffect(() => {
        if (!initialRender.current && !game.started) {
            dispatch(updateRoundCounter());
            updatePlayers();
        } else {
            initialRender.current = false;
        }
    }, [game.started]);
};

const handleEnd = ({ dispatch, players }: Pick<THandleGameProps, 'dispatch' | 'players'>) => {
    // console.log('checking game ending condition');

    useEffect(() => {
        if (players.length === 1) {
            dispatch(updateQueuePlayers(players));
            dispatch(toggleGame({ over: true }));
        }
    }, [players.length]);
};

const handleGame = () => {
    const dispatch = useDispatch();
    const { game, players, tiles, dice } = GetData();

    handleInitialize({ dispatch, game, players, tiles });
    handleRound({ dispatch, game, players, tiles, dice });
    handleEnd({ dispatch, players });
};

export default handleGame;