import handleRound from "./handleRound";

const initializeGame = () => {
    console.log('initialize game');
    // if game start
    // initialize players here
    // initialize tiles generation here
};

const handleGameEnd = () => {
    console.log('checking game ending condition');
    // check if game has met conditions to end
    // ex. 1 player left
};

const handleGame = () => {
    initializeGame();
    handleRound();
    handleGameEnd();
};

const playGame = () => {
    handleGame();
};

export default playGame;