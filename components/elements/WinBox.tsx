import getData from "../hooks/getData";
import renderPage from "../hooks/renderPage";

const WinBox = () => {
    const { players } = getData();
    const { refresh } = renderPage();
    return (
        <>
            {
                !players.length ? '' :
                    <div className='font-bold mb-2'>
                        {`${players[0].name} Wins!`}
                    </div>
            }
            <button onClick={refresh} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
        </>
    );
};

export default WinBox; 