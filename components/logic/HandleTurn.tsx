import React, { useEffect } from 'react';
import { THandleGameProps } from './HandleGame';
import GetData from '../hooks/GetData';
import { TPlayer } from '../reducers/initialStates';

const HandlePlayerActionChoice = ({ dispatch, queue, player }: { dispatch: THandleGameProps['dispatch'], queue: string[], player: TPlayer; }) => {
    const handleComputerTurn = () => {
        if (queue.length > 1 && player.type === 'computer') {
            // dice roll here
        }
    };
    handleComputerTurn();
};

const HandleDiceRoll = () => {
    // console.log('rolling dice');
    // Handle roll logic here
    // randomizing dice value display
    // determining actual dice value
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
                HandleDiceRoll();
                break;
            case 'action':
                HandlePlayerActions();
                break;
        }
    }, [phase]);
};

export default HandleTurn;