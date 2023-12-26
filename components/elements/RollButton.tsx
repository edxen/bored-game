import { useDispatch } from 'react-redux';
import { updatePhase } from '../reducers/gameReducer';
import GetData from '../hooks/GetData';

const RollButton = () => {
    const dispatch = useDispatch();
    const { game, dice, getPlayerData } = GetData();
    const { phase, queue } = game.round;
    const player = getPlayerData(queue[0]);

    const handleClick = () => {
        dispatch(updatePhase({ phase: 'roll' }));
    };

    const buttonClass = `transition-all x-5 py-4 border rounded-2xl w-full shadow-md hover:border-x-2 hover:font-semibold`;

    return (
        <>
            {phase === 'pre' ?
                <button className={buttonClass} onClick={handleClick}>
                    Roll Dice
                </button>
                :
                <button className={buttonClass}>
                    {phase === 'roll'
                        ? <span>Rolling {dice.display}</span>
                        : <span>Rolled {player.roll}</span>
                    }
                </button>
            }
        </>
    );
};

export default RollButton;