import React from 'react';
import GetData from "../hooks/GetData";
import { TTile } from '../reducers/initialStates';
import GenerateTileWithIcon from "./tiles/GenerateTileWithIcon";
import GenerateOccupants from "./tiles/GenerateOccupants";
import config from '../configuration';

function Tiles() {
    const { game, dice, tiles, getPlayerData } = GetData();
    const { queue } = game.round;

    let containerClass = () => {
        return `
        ${config.tiles?.gridColumns || 'grid-cols-11'} 
        grid gap-1 justify-items-center items-center h-full w-full p-4
        `;
    };

    let tileClass = (tile: TTile) => {
        const isEdge = tile.edge ? 'bg-slate-200' : '';
        const isOver = game.over ? 'animate-jump-out animate-duration-[2500ms]' : '';

        return `
        ${isEdge} ${isOver}
        relative
        flex justify-center items-center
        w-9 h-9
        p-2 rounded-md
        `;
    };

    let playerClass = (occupant: string) => {
        const { id, color } = getPlayerData(occupant);
        const isPlayerActive = (
            queue[0] === id ?
                `z-20 border-4 border-red-800 animate-bounce`
                : 'z-10 animate-shake animate-duration-[2000ms] animate-infinite animate-alternate'
        );

        return `
        ${isPlayerActive} ${color}
        absolute
        flex justify-center items-center h-full w-full
        text-black text-sm
        `;
    };

    let imageClass = (tile: TTile) => {
        const tileOccupied = (
            tile.occupants.length ? 'animate-ping animate-once' : 'animate-wiggle animate-infinite'
        );
        return `
            ${tileOccupied}
            z-0
        `;
    };

    return (
        <div className={containerClass()}>
            {
                tiles.map(tile => (
                    <div key={tile.index} className={tileClass(tile)}>
                        <GenerateOccupants occupants={tile.occupants} playerClass={playerClass} />
                        <div className={imageClass(tile)}>
                            <GenerateTileWithIcon type={tile.type} />
                        </div>
                    </div>
                ))
            }
        </div>
    );
}

export default Tiles;