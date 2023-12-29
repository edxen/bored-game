import CardOptions from './card/CardOptions';
import CardDetails from './card/CardDetails';
import { maxPlayers } from '../../game/Menu';

import GetData from '@/components/hooks/GetData';
import { TPlayer } from '@/components/logic/createPlayer';

export type TPlayerState = {
    playerState: {
        id?: string;
        index: number;
        players: TPlayer[];
        setPlayers: React.Dispatch<React.SetStateAction<TPlayer[]>>;
    };
};

const PlayerCard = () => {
    const { players } = GetData();

    const cardClass = 'min-h-[322px] flex flex-col gap-4 p-4 justify-center items-center border rounded-md';

    const transitionClass = (index: number) => {
        const player = players[index];

        return `
            transition-all
            ${players.length === 0 || (players.length === 2 && index === 2) ? 'sm:col-span-2' : ''}
            ${player?.id ? `${player.color} flip-360` : 'bg-slate-100'}
        `;
    };

    return (
        <>
            {
                Array.from({ length: players.length + 1 }).map((_, index) => index < maxPlayers.length && (
                    <div key={index} className={`${cardClass} ${transitionClass(index)}`}>
                        {
                            players[index]?.id
                                ? <CardDetails index={index} />
                                : <CardOptions />
                        }
                    </div>
                ))
            }
        </>
    );
};

export default PlayerCard;