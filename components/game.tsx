import getData from './hooks/getData';
import initialize from './hooks/initialize';
import monitorPlayerChange from './hooks/monitorPlayerChange';

import Turns from './elements/Turns';
import Tiles from './elements/Tiles';
import RollDiceButton from './elements/RollDiceButton';
import PlayerInformation from './elements/PlayerInformation';
import WinBox from './elements/WinBox';

export default function Game() {
    const { players } = getData();

    initialize();
    monitorPlayerChange();

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

    return (
        <div className='p-4'>
            <Turns />
            <div className='relative grid my-2'>
                <Tiles />

                <div className="absolute top-0 left-0 h-full w-full flex flex-col justify-center items-center">
                    <div className="bg-white p-4 rounded-md border border-slate-100 flex flex-col justify-center items-center">
                        {players.length > 1 ? <ControlBox /> : <WinBox />}
                    </div>
                </div>
            </div>
        </div >
    );
}