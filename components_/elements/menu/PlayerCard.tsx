import { TPlayer } from '@/components/reducers/playersReducer';
import CardOptions from './card/CardOptions';
import CardDetails from './card/CardDetails';
import { maxPlayer } from '../Menu';

export type TPlayerState = {
    playerState: {
        id?: string;
        index: number;
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
};

export const colorsList = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'violet'];
export type TColorsList = typeof colorsList[number];

export const bgColors: Record<TColorsList, string> = {
    red: 'bg-red-300',
    blue: 'bg-blue-300',
    green: 'bg-green-300',
    yellow: 'bg-yellow-300',
    orange: 'bg-orange-300',
    purple: 'bg-purple-300',
    pink: 'bg-pink-300',
    violet: 'bg-violet-300'
};

export const getRemainingColors = (players: TPlayer[], colors: string[]): string[] => {
    const usedColors = players.map(player => player.color);
    const remainingColors = colors.filter(color => !usedColors.includes(color));
    return remainingColors;
};

const PlayerCard = ({ playerState }: TPlayerState) => {
    const { index, players } = playerState;
    const id = players[index]?.id;
    playerState.id = id;

    const selectedColor = players.find(player => player.id === id)?.color || '';
    const bgClass = bgColors[selectedColor as keyof typeof bgColors];

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