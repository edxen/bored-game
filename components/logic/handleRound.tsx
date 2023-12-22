import handleTurn from "./handleTurn";

const handlePreTurn = () => {
    console.log('pre turn check');
    // update round and turn counter
};

const handlePostTurn = () => {
    console.log('post turn check');

    const handlePlayerRemoval = () => {
        // based on player positions on board, remove overlapping players besides the last to occupy
    };
};

const handleRound = () => {
    console.log('start round');

    handlePreTurn();
    handleTurn();
    handlePostTurn();
};

export default handleRound;