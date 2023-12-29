import { TPlayer } from '@/components/reducers/initialStates';
import CardOptions from './card/CardOptions';
import CardDetails from './card/CardDetails';
import { maxPlayer } from '../../game/Menu';

export type TPlayerState = {
    playerState: {
        id?: string;
        index: number;
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
};

export const getRemainingColors = (players: TPlayer[], colors: string[]): string[] => {
    const usedColors = players.map(player => player.color);
    console.log(usedColors);
    const remainingColors = colors.filter(color => !usedColors.includes(color));
    return remainingColors;
};

const PlayerCard = ({ playerState }: TPlayerState) => {
    const { index, players } = playerState;
    const id = players[index]?.id;
    playerState.id = id;

    const currentPlayer = players.find(player => player.id === id) as TPlayer;
    const bgClass = currentPlayer?.color || '';

    const cardClass = 'min-h-[322px] flex flex-col gap-4 p-4 justify-center items-center border rounded-md';
    const transitionClass = `
        ${players.length === 0 || (players.length === 2 && index === 2) ? 'sm:col-span-2' : ''}
        transition-all
        ${id
            ? `${bgClass} flip-360`
            : 'bg-slate-100'
        }
    `;

    return (
        <>
            {
                index < maxPlayer.length &&
                <div className={`${cardClass} ${transitionClass}`}>
                    {
                        id
                            ? <CardDetails playerState={playerState} />
                            : <CardOptions playerState={playerState} />
                    }
                </div>
            }
        </>
    );
};

export default PlayerCard;