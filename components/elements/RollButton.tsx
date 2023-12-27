import { useDispatch } from 'react-redux';
import { updatePhase } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';
import { setDice } from '../reducers/diceReducer';
import config from '../config';

const RollButton = () => {
    const dispatch = useDispatch();
    const { game, dice, getPlayerData } = GetData();
    const { phase, queue } = game.round;
    const player = getPlayerData(queue[0]);

    const handleRoll = () => {
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const handleForceRoll = (force: number) => {
        dispatch(updatePhase({ phase: 'roll' }));
        dispatch(setDice({ force }));
    };

    const buttonClass = `transition-all x-5 p-4 border rounded-2xl w-full shadow-md hover:bg-slate-100 hover:border-x-2 hover:font-semibold whitespace-nowrap`;

    return (
        <>
            {phase === 'pre' ?
                <div className="flex flex-col gap-2 w-full ">
                    <button className={buttonClass} onClick={handleRoll}>
                        Roll Dice
                    </button>
                    {
                        config.enableSpecificDice && (
                            <div className="flex gap-2">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <button key={i} className={buttonClass} onClick={() => handleForceRoll(i + 1)}> Roll {i + 1} </button>
                                ))}
                            </div>
                        )
                    }
                </div>
                :
                <button className={buttonClass}>
                    <span>{dice.display}</span>
                </button>
            }
        </>
    );
};

export default RollButton;