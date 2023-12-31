import Image from "next/image";
import GetData from "@/components/hooks/GetData";
import { TTile } from "../reducers/initialStates";

const TurnUI = () => {
    const { game, queue, tiles, getPlayerData, getTile } = GetData();
    const { round } = game;

    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <div className="font-bold">
                Round {round.count} Turn {round.turn}
            </div>
            <div className="flex gap-2">
                {
                    queue.map((id, i) => (
                        <div key={i} className="flex justify-center items-center gap-2 h-6">
                            <div className={`${getPlayerData(id).color} relative flex justify-center gap-2 ${getPlayerData(id).skip ? 'opacity-50' : ''} items-center px-2 rounded-lg text-sm font-medium`}>
                                <div>
                                    {getPlayerData(id).name}
                                </div>

                                <Image src={`/images/icons/icon-${getTile({ path: getPlayerData(id).path }).type}.png`} alt={id} width="14" height="14" className={`${getTile({ path: getPlayerData(id).path }).flag} h-auto w-auto rounded-full`} />
                            </div>
                            {i !== queue.length - 1 && (
                                <Image src="/images/icons/icon-arrow-left.png" alt={id} width="10" height="10" className="h-auto w-auto" />
                            )}
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default TurnUI;