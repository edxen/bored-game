import { TTile } from "@/components/reducers/tilesReducer";
import GetData from "@/components/hooks/GetData";

const GenerateOccupants = ({ occupants, playerClass }: { occupants: TTile['occupants'], playerClass: (occupants: string) => string; }) => {
    const { getPlayerData } = GetData();

    const renderOccupants = (occupants: string[]) => {
        return occupants.map((occupant) => {
            const player = getPlayerData(occupant);
            if (player) {
                return (
                    <div key={player.id} className={playerClass(occupant)}>
                        {player.name}
                    </div>
                );
            }
        });
    };

    return (
        <>
            {renderOccupants(occupants)}
        </>
    );
};

export default GenerateOccupants;