import { TPlayer } from '@/components/reducers/playersReducer';
import CardOptions from './card/CardOptions';
import CardDetails from './card/CardDetails';

export type TPlayerState = {
    playerState: {
        id?: string;
        index: number;
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
};

export const colorsList = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'violet'];

export const getRemainingColors = (players: TPlayer[], colors: string[]): string[] => {
    const usedColors = players.map(player => player.color);
    const remainingColors = colors.filter(color => !usedColors.includes(color));
    return remainingColors;
};

const PlayerCard = ({ playerState }: TPlayerState) => {
    const { index, players, setPlayers } = playerState;
    const id = players[index]?.id;
    playerState.id = id;

    const bgColor = {
        red: 'bg-red-300',
        blue: 'bg-blue-300',
        green: 'bg-green-300',
        yellow: 'bg-yellow-300',
        orange: 'bg-orange-300',
        purple: 'bg-purple-300',
        pink: 'bg-pink-300',
        violet: 'bg-violet-300',
        brown: 'bg-brown-300',
        black: 'bg-black-300',
    };

    const selectedColor = players[index]?.color || '';
    const bgClass = bgColor[selectedColor as keyof typeof bgColor];

    const cardClass = 'min-h-[322px] flex flex-col gap-4 p-4 justify-center items-center border rounded-md';

    return (
        <>
            <div className={`${cardClass} ${bgClass}`}>
                <CardDetails playerState={playerState} />
            </div>
            <div className={`${cardClass}`}>
                <CardOptions playerState={playerState} />
            </div>
        </>
    );
};

export default PlayerCard;