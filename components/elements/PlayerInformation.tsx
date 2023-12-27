import getData from "../hooks/GetData";
import { TPlayerAction, playerAction } from "../reducers/initialStates";

const PlayerInformation = () => {
    const { game, players } = getData();
    const { queue } = game.round;


    return (
        <div className="grid grid-cols-2 gap-2">
            {
                players.map((player, i) => (
                    <div className="flex flex-col justify-flex-start items-center gap-[0.5px]">
                        <div className={`${player.color} text-black w-full border rounded-lg px-4 py-1 font-bold text-center`}>
                            {player.name}
                        </div>
                        {player.action && Object.values(player.action).some(value => value === true) &&
                            <div className={`${player.color} flex flex-col gap-1 p-1 rounded-md flex-grow`}>
                                {
                                    player.action && Object.entries(player.action).map(([key, value]) => (
                                        value === true && (
                                            <div key={key} className="bg-white text-black border rounded-xl font-medium px-4 py-1">
                                                {playerAction[key as keyof TPlayerAction]}
                                            </div>
                                        )
                                    ))
                                }
                            </div >
                        }
                    </div>
                ))
            }
        </div>
    );
};

export default PlayerInformation;