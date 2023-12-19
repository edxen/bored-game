import getData from './hooks/getData';
import initialize from './hooks/initialize';
import monitorPlayerChange from './hooks/monitorPlayerChange';

import Turns from './elements/Turns';
import Tiles from './elements/Tiles';
import Menu from './elements/Menu';
import RollDiceButton from './elements/RollDiceButton';
import PlayerInformation from './elements/PlayerInformation';
import WinBox from './elements/WinBox';

export default function Game() {
    const { players } = getData();

    initialize();
    monitorPlayerChange();
    return (
        <div className='flex flex-col h-screen p-4'>
            <div className='w-full flex flex-col justify-center items-center text-sm text-gray-700 font-bold'>
                <h1 className='text-2xl text-black rotate-6'>Bored Game</h1>
                <h4 className='m-[-.50rem]'>by</h4>
                <h4 className='-rotate-3'>Edxen the Bored Developer</h4>
            </div>
            <Turns />
            <div className='flex-1 relative grid my-2'>
                {
                    players.length === 0
                        ?
                        <div className="h-full w-full flex flex-col justify-center items-center">
                            <Menu />
                        </div>
                        :
                        <>
                            <div className="h-full w-full grid gap-4 grid-cols-10 justify-center items-center">
                                <Tiles />
                            </div>
                            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                                <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col justify-center items-center">
                                    {
                                        players.length === 1
                                            ? <WinBox />
                                            : <ControlBox />
                                    }

                                </div>
                            </div>
                        </>
                }
            </div>
        </div >
    );
}

const ControlBox = () => {
    return (
        <>
            <div className="flex justify-center items-center gap-2 w-full mb-2">
                <RollDiceButton />
            </div>
            <div className='flex gap-2'>
                <PlayerInformation />
            </div>
        </>
    );
};