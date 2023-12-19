import GetData from "../hooks/GetData";
import { TPlayer } from "../reducers/playersReducer";

const Turns = () => {
    const { turns } = GetData();

    return (
        <>
            {
                !turns.players.length ? '' :
                    <div className='flex justify-center items-center gap-2 my-2'>
                        <div className='font-bold'>Round {turns.round} | Turns {turns.turn} :</div>
                        {turns.players.map((player: TPlayer, i) => (
                            <div className='flex gap-2' key={player.id}>
                                <div>{'>>'}</div>
                                <div className={i === 0 ? `${player} font-bold underline` : ''}>{player.name}</div>
                            </div>
                        ))}
                    </div>
            }
        </>
    );
};

export default Turns;