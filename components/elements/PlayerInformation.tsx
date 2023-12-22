import getData from "../hooks/GetData";

const PlayerInformation = () => {
    const { game, players } = getData();
    const { queue } = game.round;


    return (
        <>
            {
                players.map((player, i) => (
                    <div className={`${player.color} flex flex-col justify-center items-center border p-3 ${queue.length && queue[0] === player.id ? 'border-4 border-black' : ''}`} key={i}>
                        <div className='font-bold'>{player.name}</div>
                        <div>
                            {Object.entries(player).map(([key, value]) => (
                                ['type', 'color', 'path', 'roll', 'last_path'].includes(key) &&
                                <div key={key + value}>
                                    {`${key}: ${value && value.toString().replace('bg-', '').replace('-300', '')}`}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            }
        </>
    );
};

export default PlayerInformation;