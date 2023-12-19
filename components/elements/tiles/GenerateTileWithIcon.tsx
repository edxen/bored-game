import React from 'react';
import Image from "next/image";
import { TTile } from "@/components/reducers/tilesReducer";

type TImageRefArr = Partial<{ [key in TTile['type']]: string; }>;

const iconsList: TImageRefArr = {
    portal: 'portal',
    dice: 'dice',
    flag: 'flag',
    safe: 'safe',
    stop: 'stop'
};

interface IGenerateTileWithIcon {
    type: TTile['type'],
    iconsListRef?: TImageRefArr;
}
const GenerateTileWithIcon = ({ type, iconsListRef = iconsList }: IGenerateTileWithIcon) => {
    if (!iconsListRef.hasOwnProperty(type)) {
        if (type !== 'plain') { // plain is expected to not have icon at the time of writing
            console.error(`icon not found for type: ${type}`);
        }
        return null;
    }

    const typeRef = iconsList[type];

    return (
        <Image
            className="absolute"
            src={`/images/icons/icon-${typeRef}.png`}
            alt={type} width="150"
            height="150"
        />
    );
};

export default GenerateTileWithIcon;