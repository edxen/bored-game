import Image from "next/image";

import { TTile } from "@/components/reducers/tilesReducer";

type TTileTypeExcludePlain = Exclude<TTile['type'], 'plain'>;
type TImageRefArr = {
    [key in TTileTypeExcludePlain]: string;
};

const imageRefArr: TImageRefArr = {
    portal: 'wormhole'
};

export const hasIconForTileType = (tile: TTile): boolean => {
    return Object.keys(imageRefArr).includes(tile.type);
};

const GenerateTileWithIcon = ({ tile }: { tile: TTile; }) => {
    return (
        <>
            {
                hasIconForTileType(tile) &&
                <Image className="absolute" src={`/images/icons/icon-${imageRefArr[tile.type as TTileTypeExcludePlain]}.png`} alt={tile.type} width="150" height="150"></Image>
            }
        </>

    );
};

export default GenerateTileWithIcon;