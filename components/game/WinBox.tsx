import GetData from "../hooks/GetData";
import RenderPage from "../hooks/RenderPage";

const WinBox = () => {
    const { game, queue, players, getPlayerData } = GetData();
    const { refresh } = RenderPage();

    const rankSuffix = ['nd', 'rd', 'th'];
    return (
        <>
            <div className='text-3xl underline font-bold mb-2 animate-jump animate-infinite animate-duration-1000 animate-alternate '>
                {`Winner: ${getPlayerData(queue[0]).name}`}
            </div>
            <div className='mb-2 flex flex-col items-start'>
                {
                    game.ranking.map((rank, i) => (
                        rank !== queue[0] && (
                            <div className='text-xl' key={i}>
                                {`${i + 2}${rankSuffix[i]}: ${getPlayerData(rank).name} `}
                            </div>
                        )
                    ))
                }
            </div>
            <button onClick={refresh} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
        </>
    );
};

export default WinBox; 