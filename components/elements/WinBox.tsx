import getData from "../hooks/getData";
import renderPage from "../hooks/renderPage";

const WinBox = () => {
    const { players } = getData();
    const { refresh } = renderPage();
    return (
        <>
            {
                `${players[0].name} wins!`
            }
            <button onClick={refresh} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
        </>
    );
};

export default WinBox; 