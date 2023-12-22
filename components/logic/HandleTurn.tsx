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

const HandleTurn = () => {
    // console.log('start turn');

    HandlePlayerActionChoice();
    HandleDiceRoll();
    HandlePlayerActions();
};

export default HandleTurn;