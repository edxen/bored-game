import React, { useEffect } from 'react';
import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';
import { TPlayer } from '../reducers/initialStates';
import { setDice } from '../reducers/diceReducer';
import { setPlayer } from '../reducers/playersReducer';
import { updatePhase } from '../reducers/gameReducer';
import config from '../config';

const HandlePlayerActionChoice = ({ dispatch, queue, player }: { dispatch: THandleGameProps['dispatch'], queue: string[], player: TPlayer; }) => {
    const handleComputerTurn = () => {
        if (queue.length > 1 && player.type === 'computer') {
            // dice roll here
        }
    };
    handleComputerTurn();
};

const HandleDiceRoll = ({ dispatch, player }: { dispatch: THandleGameProps['dispatch'], player: TPlayer; }) => {
    const randomize = () => Math.floor(Math.random() * 6) + 1;

    const randomizeDiceDisplay = () => dispatch(setDice({ display: randomize() }));

    const diceRoll = (force: Partial<number> = 0) => {
        const countInterval = 10;
        let count = force ? countInterval : 0;

        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                randomizeDiceDisplay();
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: force ?? randomize() }));
                dispatch(updatePhase({ phase: 'action' }));
            }
        }, config.rollSpeed || 150);

        if (player) rollingInterval;
    };

    diceRoll();
};

const HandlePlayerActions = () => {
    // console.log('handling player movement');
    // Handle player movements after determining dice roll
    // Handle additional actions related to movement as well: ex. portal warping
};

const HandleTurn = ({ dispatch, game, players, tiles, dice }: THandleGameProps) => {
    const { round } = game;
    const { phase, queue } = round;
    const { getPlayerData } = GetData();
    const player = getPlayerData(queue[0]);

    useEffect(() => {
        switch (phase) {
            case 'pre':
                HandlePlayerActionChoice({ dispatch, queue, player });
                break;
            case 'roll':
                HandleDiceRoll({ dispatch, player });
                break;
            case 'action':
                HandlePlayerActions();
                break;
        }
    }, [phase]);
};

export default HandleTurn;