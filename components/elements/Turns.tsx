import GetData from "../hooks/GetData";

const Turns = () => {
    const { game, getPlayerData } = GetData();
    const { round } = game;

    const queuePlayers = round.queue.map(id => getPlayerData(id));
    if (!queuePlayers.length) return;

    return (
        <div className='flex justify-center items-center gap-2 my-2'>
            <div className='font-bold'>Round {round.count} | Turns {round.turn} :</div>
            {queuePlayers.map((player, i) => player && (
                <div className='flex gap-2' key={player.id}>
                    <div>{'>>'}</div>
                    <div className={i === 0 ? `font-bold underline` : ''}>{player.name}</div>
                </div>
            ))}
        </div>
    );
};

export default Turns;