import getData from "../hooks/getData";
import { TTile } from "../reducers/tilesReducer";

function Tile({ tile }: { tile: TTile; }) {
    const { getPlayerData } = getData();

    let tileClass = 'relative flex justify-center items-center min-w-[2.5rem] w-10 h-10 border border-slate-100';

    const typeClasses: Record<TTile['type'], string> = {
        plain: 'bg-slate-200',
        portal: 'portal-icon'
    };

    let typeClass = typeClasses[tile.type];

    const renderOccupants = (occupants: string[]) => {
        return occupants.map((occupant) => {
            const playerData = getPlayerData(occupant);
            if (playerData) {
                const { id, color, name } = playerData;

                return (
                    <div className={`${tileClass} ${color} text-white z-10`} key={id}>
                        {name}
                    </div>
                );
            }
        });
    };

    return (
        <div className="w-full flex justify-center items-center">
            <div className={tile.edge ? `${tileClass} ${typeClass}` : `${tileClass}`}>
                {
                    renderOccupants(tile.occupants)
                }
                <div className='absolute z-0'>
                    {tile.path ? tile.path : ''}
                </div>
            </div>
        </div>
    );
}

export default Tile;