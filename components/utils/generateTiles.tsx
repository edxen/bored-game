import config from "../config";
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
const tilePath: Partial<Record<Exclude<TTileType, 'plain'>, number[]>> = {
    // add manually here
    // can manually add using dynamicallyAssignPathSet
};

const dynamicallyAssignPathSet = () => {
    const { columns } = config.tiles.size;

    Array.from({ length: 4 }).map((_, i) => {
        const addTypeEachLine = (key: Exclude<TTileType, 'plain'>, targetPaths: number[]) => {
            if (!tilePath[key]) tilePath[key] = [];
            targetPaths.forEach((targetPath) => tilePath[key]?.push((((columns * i) - i)) + targetPath));
        };
        // add below using addPathToSet | check TTileType for allowed types
        // first arg: type id | second arg: array for tile location per line 1 - 10, add to repeat
        // added type will mirror on all sides

        addTypeEachLine('flag', [1]);
        addTypeEachLine('portal', [6]);
        addTypeEachLine('dice', [2, 5, 7, 10]);
        addTypeEachLine('stop', [3, 9]);
        addTypeEachLine('safe', [4, 8]);

    });
};

const assignTypeToPath = (path: number): TTileType => {
    let type: Partial<TTileType> = 'plain';
    dynamicallyAssignPathSet();

    Object.entries(tilePath).forEach(([key, value]) => value.includes(path) && (type = key as TTileType));

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