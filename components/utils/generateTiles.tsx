import { TTile } from "../reducers/tilesReducer";

type TNumberParams = { [key: string]: number; };

// in a setting where columns is 10 and rows is 10, i get 100 tiles
// tile line will be decided from first to last minus 1
// for ex. 
// top edge     = 1-9
// right edge   = 10-18
// bottom edge  = 19-27
// left edge    = 28-36

const getPath = ({ row, rows, column, columns }: TNumberParams): number => { // Get back here to refactor for accomodate different vector size
    const isTop = () => row === 0;
    const isRight = () => column === columns - 1 && row !== rows - 1;
    const isBottom = () => row === rows - 1 && column !== 0;
    const isLeft = () => column === 0;

    let path = 0;

    switch (true) {
        case isTop():
            path = column;
            break;
        case isRight():
            path = columns + row;
            break;
        case isBottom():
            path = columns * 2 + (columns - column);
            break;
        case isLeft():
            path = (columns * 3) + (rows - row);
            break;
    }
    return path;
};

type TTileType = TTile['type'];
const assignTypeToPath = (path: number): TTileType => {
    let type: Partial<TTileType> = 'plain';

    const pathSet: Record<Exclude<TTileType, 'plain'>, number[]> = {
        portal: [6, 15, 24, 33]
    };

    Object.entries(pathSet).forEach(([key, value]) => {
        if (value.includes(path)) type = key as TTileType;
    });

    return type;
};

const generateTiles = ({ columns, rows }: TNumberParams): TTile[] => {
    return Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const edge = row === 0 || row === rows - 1 || column === 0 || column === columns - 1;
        const path = edge ? getPath({ row, rows, column, columns }) : 0;

        return {
            index,
            edge,
            path,
            type: assignTypeToPath(path),
            occupants: []
        };
    });
};

export default generateTiles;