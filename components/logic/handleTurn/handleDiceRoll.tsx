import config from "@/components/configuration";
import { THandleTurnProps, randomizedNumber } from "../HandleTurn";
import { setDice } from "@/components/reducers/diceReducer";
import { updateGame, updatePhase } from "@/components/reducers/gameReducer";
import { setPlayer } from "@/components/reducers/playersReducer";

const HandleDiceRoll = ({ dispatch, player, dice }: Omit<THandleTurnProps, 'getTile'>) => {
    const diceRoll = () => {
        const countInterval = 15;
        let count = dice.force !== 0 ? countInterval : config.diceInterval ? config.diceInterval : 0;
        let rolled: number = dice.force !== 0 ? dice.force : 1;
        const rollingInterval = setInterval(() => {
            if (count !== countInterval) {
                rolled = randomizedNumber({ min: dice.min, max: dice.max });
                dispatch(setDice({ display: 'Rolling', current: rolled }));
                count++;
            } else {
                clearInterval(rollingInterval);
                dispatch(setDice({ min: 1, max: 6, force: 0, display: 'Rolled', current: rolled }));
                dispatch(updateGame({ target: 'history', value: [`${player.name} rolled ${rolled}`] }));
                dispatch(setPlayer({ id: player.id, last_path: player.path, roll: rolled }));
                setTimeout(() => dispatch(updatePhase({ phase: 'action' })), config.delay || 1000);
            }
        }, config.rollSpeed || 150);

        if (player) rollingInterval;
    };

    diceRoll();
};

export default HandleDiceRoll;