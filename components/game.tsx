import getData from './hooks/GetData';

import Turns from './elements/Turns';
import Tiles from './elements/Tiles';
import Menu from './elements/Menu';
import RollDiceButton from './elements/RollDiceButton';
import PlayerInformation from './elements/PlayerInformation';
import WinBox from './elements/WinBox';
import handleGame from './logic/handleGame';

export default function Game() {
    const { game, players } = getData();

    handleGame();

    return (
        <div className='flex flex-col h-screen p-4'>
            <div className='w-full flex flex-col justify-center items-center my-5 text-sm text-gray-700 font-bold'>
                <h1 className='text-2xl text-black rotate-6'>Bored Game</h1>
                <h4 className='m-[-.50rem]'>by</h4>
                <h4 className='-rotate-3'>Edxen the Bored Developer</h4>
            </div>
            <Turns />
            <div className='flex justify-center items center flex-1 relative my-2'>
                {
                    !game.started
                        ?
                        <div className="h-full w-full flex flex-col justify-center items-center">
                            <Menu />
                        </div>
                        :
                        <>
                            <Tiles />
                            <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                                <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col justify-center items-center">
                                    {
                                        !game.over
                                            ? <ControlBox />
                                            : <WinBox />
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