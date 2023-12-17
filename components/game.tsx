import Tiles from './elements/Tiles';
import RollDiceButton from './elements/rollDiceButton';
import getData from './hooks/getData';
import page from './hooks/reloadPage';
import initialize from './hooks/initialize';
import monitorPlayerChange from './hooks/monitorPlayerChange';
import Turns from './elements/Turns';

export default function Game() {
    const { players } = getData();
    const { refresh } = page();

    initialize();
    monitorPlayerChange();

    return (
        <div className='p-4'>
            <Turns />
            <div className='relative grid my-2'>
                <Tiles />

                <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                    <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col justify-center items-center">
                        {
                            players.length > 1
                                ? <>
                                    <div className="flex justify-center items-center gap-2 w-full mb-2">
                                        <RollDiceButton />
                                    </div>
                                    <div className='flex gap-2'>
                                        {players.map((player, i) => (
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
                                        ))}
                                    </div>
                                </>
                                : <>
                                    {
                                        `${players[0].name} wins!`
                                    }
                                    <button onClick={refresh} className='text-lg border rounded-md px-4 py-2 w-full'>Restart</button>
                                </>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}