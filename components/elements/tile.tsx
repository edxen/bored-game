import { TPlayer } from "../reducers/playersReducer";

function Tile({ players, occupants, edge, path }: { players: TPlayer[], occupants: string[], path: number, edge: boolean; }) {
    let tileClass = 'flex justify-center items-center min-w-[2.5rem] w-10 h-10 border border-slate-100';

    return (
        <div className="w-full flex justify-center items-center">
            <div className={edge ? `${tileClass} bg-slate-200` : `${tileClass}`}>
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