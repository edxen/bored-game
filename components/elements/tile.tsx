import getData from "../hooks/getData";
import { TPlayer } from "../reducers/playersReducer";
import { TTile } from "../reducers/tilesReducer";

function Tile({ occupants, edge, type, path }: { players: TPlayer[], occupants: string[], path: number, edge: boolean, type: TTile['type']; }) {
    const { getPlayerData } = getData();

    let tileClass = 'flex justify-center items-center min-w-[2.5rem] w-10 h-10 border border-slate-100';

    const typeClasses: Record<TTile['type'], string> = {
        plain: 'bg-slate-200',
        portal: 'portal-icon'
    };

    let typeClass = typeClasses[type];

    const renderOccupants = (occupants: string[]) => {
        return occupants.map((occupant) => {
            const playerData = getPlayerData(occupant);
            if (playerData) {
                const { id, color, name } = playerData;

                return (
                    <div className={`${tileClass} ${color} text-white`} key={id}>
                        {name}
                    </div>
                );
            }
        });
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className={edge ? `${tileClass} ${typeClass}` : `${tileClass}`}>
                {
                    renderOccupants(occupants)
                }
            </div>
        </div>
    );
}

export default Tile;