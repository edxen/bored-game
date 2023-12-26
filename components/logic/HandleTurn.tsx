import React, { useEffect } from 'react';
import { THandleGameProps } from './HandleGame';

const HandlePlayerActionChoice = () => {
    // console.log('determining current player');
    // if current player is human, display dice options
    // if computer, apply computer logic for dice options
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
    const { phase } = game.round;

    useEffect(() => {
        switch (phase) {
            case 'pre':
                HandlePlayerActionChoice();
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