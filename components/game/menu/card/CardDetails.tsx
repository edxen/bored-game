import { useDispatch } from 'react-redux';

import CustomSelect from '../CustomSelect';
import CustomInput from '../CustomInput';
import CustomButton from '../CustomButton';

import { TPlayer } from '@/components/reducers/initialStates';
import { colorsList } from '@/components/logic/createPlayer';
import { setPlayers } from '@/components/reducers/playersReducer';

import GetData from '@/components/hooks/GetData';
import { THandleGameProps } from '@/components/logic/HandleGame';

export const getRemainingColorsList = (players: TPlayer[]) => {
    const usedColors = [] as string[];
    const remainingColors = [] as string[];

    players.forEach(player => {
        const readableColor = player.color.replace(/^bg-(\w+)-\d+$/, '$1');
        usedColors.push(readableColor);
    });

    colorsList.forEach(colors => {
        if (!usedColors.includes(colors)) {
            remainingColors.push(colors);
        }
    });

    return remainingColors;
};

type TProps = { index: number; };

type TState = {
    dispatch: THandleGameProps['dispatch'],
    player: TPlayer,
    players: TPlayer[],
};

export type TCardProps = {
    props: {
        state: TState;
        label: string;
        subLabel?: string;
        list?: string[];
        value: string;
    };
};

const CardDetails = ({ index }: TProps) => {
    const dispatch = useDispatch();
    const { players } = GetData();

    const state = { dispatch, player: players[index], players, setPlayers };

    const name = {
        state,
        label: 'Name',
        subLabel: "Max 3 Characters",
        value: players[index]?.name
    };
    const colors = {
        state,
        label: 'Color',
        list: getRemainingColorsList(players),
        value: players[index]?.color.replace(/^bg-(\w+)-\d+$/, '$1')
    };
    const type = {
        state,
        label: 'Type',
        list: ['human', 'computer'],
        value: players[index]?.type
    };

    const removePlayer = {
        label: 'Remove Player',
        click: () => {
            const filteredPlayers = players.filter(player => player.id !== players[index].id);
            dispatch(setPlayers(filteredPlayers));
        }
    };

    return (
        <>
            <CustomInput props={name} />
            <CustomSelect props={colors} />
            <CustomSelect props={type} />
            <CustomButton props={removePlayer} />
        </>
    );
};

export default CardDetails;