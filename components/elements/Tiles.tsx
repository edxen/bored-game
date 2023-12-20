import GetData from "../hooks/GetData";
import GenerateTileWithIcon from "./tiles/GenerateTileWithIcon";
import { TTile } from "../reducers/tilesReducer";
import { TPlayer } from "../reducers/playersReducer";
import config from "../config";
import GenerateOccupants from "./tiles/GenerateOccupants";

function Tiles() {
    const { turns, tiles, getPlayerData } = GetData();

    let containerClass = () => {
        return `
        ${config.tiles.gridColumns} 
        grid gap-4 justify-items-center items-center h-full w-full 
        `;
    };

    let tileClass = (tile: TTile) => {
        const isEdge = tile.edge ? 'bg-slate-200' : '';

        return `
        ${isEdge}
        relative
        flex justify-center items-center
        min-w-[2.5rem] w-10 h-10
        p-1 rounded-md
        `;
    };

    let playerClass = (occupant: string) => {
        const { id, color } = getPlayerData(occupant);
        const isPlayerActive = turns.players[0].id === id ? 'border-4 border-red-800' : '';

        return `
        ${isPlayerActive} ${color}
        absolute z-10
        flex justify-center items-center h-full w-full
        text-white
        `;
    };

    return (
        <div className={containerClass()}>
            {
                tiles.map(tile => (
                    <div key={tile.index} className={tileClass(tile)}>
                        <GenerateOccupants occupants={tile.occupants} playerClass={playerClass} />
                        <div className='z-0'>
                            <GenerateTileWithIcon type={tile.type} />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Tiles;