import { TPlayer } from "../reducers/playersReducer";
import { TTile } from "../reducers/tilesReducer";

function Tile({ players, occupants, edge, type, path }: { players: TPlayer[], occupants: string[], path: number, edge: boolean, type: TTile['type']; }) {
    let tileClass = 'flex justify-center items-center min-w-[2.5rem] w-10 h-10 border border-slate-100';

    const typeClasses: Record<TTile['type'], string> = {
        plain: 'bg-slate-200',
        portal: 'portal-icon'
    };

    let typeClass = typeClasses[type];

    return (
        <div className="w-full flex justify-center items-center">
            <div className={edge ? `${tileClass} ${typeClass}` : `${tileClass}`}>
                {
                    players.map(player => (
                        occupants.includes(player.id) &&
                        <div className={`${tileClass} ${player.color} text-white`} key={player.id}>{player.name}</div>
                    ))
                }
            </div>
        </div>
    );
}

export default Tile;