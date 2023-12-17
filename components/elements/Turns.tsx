import getData from "../hooks/getData";
import { TPlayer } from "../reducers/playersReducer";

const Turns = () => {
    const { turns } = getData();

    return (
        <>
            {
                !turns.length ? '' :
                    <div className='flex justify-center items-center gap-2 my-2'>
                        <div className='font-bold'>Turns:</div>
                        {turns.map((player: TPlayer, i) => (
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