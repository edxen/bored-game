import { TTile } from "../reducers/tilesReducer";

type TNumberParams = { [key: string]: number; };

const getEdge = ({ row, rows, column, columns }: TNumberParams) => {
    const top = () => row === 0;
    const right = () => column === columns - 1 && row !== rows - 1;
    const bottom = () => row === rows - 1 && column !== 0;
    const left = () => column === 0;
    const all = () => top() || right() || bottom() || left();

    return { top, right, bottom, left, all };
};

const getPath = (vector: TNumberParams): number => {
    const { row, rows, column, columns } = vector;

    switch (true) {
        case getEdge(vector).top(): return column + 1;
        case getEdge(vector).right(): return columns + row;
        case getEdge(vector).bottom(): return ((columns * 2) + rows) - column - 2;
        case getEdge(vector).left(): return (columns * 2) + (rows * 2) - row - 3;
    }
    return 0;
};

type TTileType = TTile['type'];
const assignTypeToPath = (path: number): TTileType => {
    let type: Partial<TTileType> = 'plain';

    const pathSet: Record<Exclude<TTileType, 'plain'>, number[]> = {
        portal: [6, 15, 24, 33]
    };

    Object.entries(pathSet).forEach(([key, value]) => value.includes(path) && (type = key as TTileType));

    return type;
};

const generateTiles = ({ columns, rows }: TNumberParams): TTile[] => {
    return Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const vector: TNumberParams = { row, rows, column, columns };
        const edge = getEdge(vector).all();
        const path = edge ? getPath(vector) : 0;

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