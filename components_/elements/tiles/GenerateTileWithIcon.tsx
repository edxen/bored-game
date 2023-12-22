import React from 'react';
import Image from "next/image";
import { TTile } from '../../reducers/tilesReducer';

type TImageRefArr = Partial<{ [key in TTile['type']]: string; }>;

const iconsList: TImageRefArr = {
    portal: 'portal',
    dice: 'dice',
    flag: 'flag',
    safe: 'safe',
    stop: 'stop',
    'arrow-up': 'arrow-up',
    'arrow-down': 'arrow-down',
    'arrow-left': 'arrow-left',
    'arrow-right': 'arrow-right',
    'arrow-up-left': 'arrow-up-left',
    'arrow-up-right': 'arrow-up-right',
    'arrow-down-left': 'arrow-down-left',
    'arrow-down-right': 'arrow-down-right'
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
            className="object-contain"
            src={`/images/icons/icon-${typeRef}.png`}
            alt={type}
            width='100'
            height='100'
        />
    );
};

export default GenerateTileWithIcon;