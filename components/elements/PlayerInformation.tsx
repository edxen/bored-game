import getData from "../hooks/getData";

const PlayerInformation = () => {
    const { turns, players } = getData();

    return (
        <>
            {
                players.map((player, i) => (
                    <div className={`${player.color} flex flex-col justify-center items-center border p-3 ${turns.players.length && turns.players[0].id === player.id ? 'border-4 border-black' : ''}`} key={i}>
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