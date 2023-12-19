import GetData from "../hooks/GetData";
import GenerateTileWithIcon from "./tiles/GenerateTileWithIcon";

function Tiles() {
    const { turns, tiles, getPlayerData } = GetData();

    let tileClass = 'relative flex justify-center items-center min-w-[2.5rem] w-10 h-10 border';

    const renderOccupants = (occupants: string[]) => {
        return occupants.map((occupant) => {
            const playerData = getPlayerData(occupant);
            if (playerData) {
                const { id, color, name } = playerData;

                return (
                    <div className={`${tileClass} ${color} ${turns.players.length && turns.players[0].id === id ? 'border-4 border-red-800' : 'border-slate-100'} text-white z-10`} key={id}>
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
                        <div className={`${tileClass} ${tile.edge ? 'bg-slate-200' : ''}`}>
                            <GenerateTileWithIcon type={tile.type} />
                            {renderOccupants(tile.occupants)}
                            <div className='absolute z-0'>
                                {tile.edge ? tile.path : ''}
                            </div>
                        </div>
                    </div>
                ))
            }
        </>
    );
}

export default Tiles;