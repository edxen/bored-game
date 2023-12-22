const handlePlayerActionChoice = () => {
    // console.log('determining current player');
    // if current player is human, display dice options
    // if computer, apply computer logic for dice options
};

const handleDiceRoll = () => {
    // console.log('rolling dice');
    // handle roll logic here
    // randomizing dice value display
    // determining actual dice value
};

const handlePlayerActions = () => {
    // console.log('handling player movement');
    // handle player movements after determining dice roll
    // handle additional actions related to movement as well: ex. portal warping
};

const handleTurn = () => {
    // console.log('start turn');

    handlePlayerActionChoice();
    handleDiceRoll();
    handlePlayerActions();
};

export default handleTurn;