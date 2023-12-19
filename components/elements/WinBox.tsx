import getData from "../hooks/getData";
import renderPage from "../hooks/renderPage";

const WinBox = () => {
    const { turns, players } = getData();
    const { refresh } = renderPage();

    const rankSuffix = ['nd', 'rd', 'th'];
    return (
        <>
            {
                !players.length ? '' :
                    <>
                        <div className='text-3xl underline font-bold mb-2'>
                            {`Winner: ${players[0].name}`}
                        </div>
                        <div className='mb-2 flex flex-col items-start'>
                            {
                                turns.ranking.map((rank, i) => (
                                    rank !== players[0].name && (
                                        <div className='text-xl' key={i}>
                                            {`${i + 2}${rankSuffix[i]}: ${rank} `}
                                        </div>
                                    )
                                ))
                            }
                        </div>
                        <button onClick={refresh} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
                    </>
            }
        </>
    );
};

export default WinBox; 