import getData from "../hooks/getData";
import { TTile } from "../reducers/tilesReducer";

function Tiles() {
    const { tiles, getPlayerData } = getData();

    let tileClass = 'relative flex justify-center items-center min-w-[2.5rem] w-10 h-10 border border-slate-100';

    const typeClasses: Record<TTile['type'], string> = {
        plain: 'bg-slate-200',
        portal: 'portal-icon'
    };

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
        <>
            {
                tiles.map((tile, i) => (
                    <div className="w-full flex justify-center items-center" key={i}>
                        <div className={tile.edge ? `${tileClass} ${typeClasses[tile.type]}` : `${tileClass}`}>
                            {renderOccupants(tile.occupants)}
                            <div className='absolute z-0'>
                                {tile.path ? tile.path : ''}
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default Tiles;