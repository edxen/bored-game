import getData from "../hooks/getData";

const PlayerInformation = () => {
    const { players } = getData();

    return (
        <>
            {
                players.map((player, i) => (
                    <div className='border p-3' key={i}>
                        <div className='font-bold'>{player.name}</div>
                        <div>
                            {Object.entries(player).map(([key, value]) => (
                                !['type'].includes(key) &&
                                <div key={key + value}>
                                    {`${key}: ${value}`}
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