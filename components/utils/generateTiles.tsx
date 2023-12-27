import { TTile } from "../reducers/initialStates";
import { getEdge, getPath, getSameSideColumn } from "./helper";

type TTileType = TTile['type'];
type TTileTypeNoPlain = Exclude<TTileType, 'plain'>;

type TAssignType = (
    edge: boolean,
    index: number,
    path: number,
    vector: { [key: string]: number; }
) => TTileType;

type TAddTypeEachLine = (
    key: TTileTypeNoPlain,
    targetArr: number[],
    index?: Partial<{ [key: string]: number; }>
) => void;

type TTileArray = [
    TTileTypeNoPlain,
    number[],
    Partial<{ [key: string]: number; }>
];

type TTileSet = {
    [key: string]: TTileArray[];
};

const assignType: TAssignType = (edge, index, path, vector) => {
    const tileIndex: Partial<Record<TTileTypeNoPlain, number[]>> = {};
    const { columns, rows } = vector;

    let type: Partial<TTileType> = 'plain';

    const indexObjects = { index: 0, column: 0, row: 0, repeat: 0 };

    const addTypeEachLine: TAddTypeEachLine = (type, targetArr, index = { ...indexObjects }) => {
        Array.from({ length: edge ? 4 : index.repeat ? index.repeat : 1 }).map((_, i) => {
            if (!tileIndex[type]) tileIndex[type] = [];
            targetArr.forEach((target) => {
                const { column, row, repeat } = index;
                const targetSum = (target + (repeat ?? 0));
                const getColumnIndex = (columns * targetSum) - (i * columns) + (column ?? 0);
                const getRowIndex = ((rows * (row ?? 0)) - i) + targetSum;

                tileIndex[type]?.push(edge ? getSameSideColumn(i, target) : column ? getColumnIndex : getRowIndex);
            });
        });
    };

    const tileSet: TTileSet = {
        path: [
            ['flag', [1], {}],
            ['portal', [6], {}],
            ['dice', [2, 5, 7, 10], {}],
            ['stop', [3, 9], {}],
            ['safe', [4, 8], {}]
        ],
        index: [
            ['arrow-down-right', [1], { column: 9 }],
            ['arrow-down-left', [9], { column: 9 }],
            ['arrow-up-left', [9], { column: 1 }],
            ['arrow-up-right', [1], { column: 1 }]
        ]
    };

    const addTileSet = (set: TTileArray[]) => set.forEach(item => addTypeEachLine(...item));
    addTileSet(edge ? tileSet.path : tileSet.index);

    Object.entries(tileIndex).forEach(([key, value]) => value.includes(edge ? path : index) && (type = key as TTileType));

    return type;
};


type TGenerateTiles = (options: { columns: number; rows: number; }) => TTile[];

const generateTiles: TGenerateTiles = ({ columns, rows }) => {
    return Array.from({ length: columns * rows }, (_, index) => {
        const row = Math.floor(index / columns);
        const column = index % columns;
        const vector: { [key: string]: number; } = { row, rows, column, columns };
        const edge = getEdge(vector).all();
        const path = edge ? getPath(vector) : 0;

        return {
            index,
            edge,
            path,
            type: assignType(edge, index, path, vector),
            occupants: []
        };
    });
};

export default generateTiles;