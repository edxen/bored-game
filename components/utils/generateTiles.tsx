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

const assignType = (edge: boolean, index: number, path: number, vector: TNumberParams): TTileType => {
    const tileIndex: Partial<Record<Exclude<TTileType, 'plain'>, number[]>> = {};

    let type: Partial<TTileType> = 'plain';
    const { columns, rows } = vector;

    const addTypeEachLine = (key: Exclude<TTileType, 'plain'>, targetArr: number[], index: Partial<TNumberParams> = { column: 0, row: 0, repeat: 0 }) => {
        Array.from({ length: edge ? 4 : index.repeat ? index.repeat : 1 }).map((_, i) => {
            if (!tileIndex[key]) tileIndex[key] = [];
            targetArr.forEach((target) => {
                if (edge) {
                    tileIndex[key]?.push((((columns * i) - i)) + target);
                } else {
                    if (index.column) {
                        tileIndex[key]?.push((((columns * (target + (index.repeat ? index.repeat : 0))) - (i * columns))) + index.column);
                    } else if (index.row) {
                        tileIndex[key]?.push((((rows * index.row) - i)) + target + (index.repeat ? index.repeat : 0));
                    }
                }
            });
        });
    };

    if (edge) {
        addTypeEachLine('flag', [1]);
        addTypeEachLine('portal', [6]);
        addTypeEachLine('dice', [2, 5, 7, 10]);
        addTypeEachLine('stop', [3, 9]);
        addTypeEachLine('safe', [4, 8]);
    } else {
        addTypeEachLine('arrow-left', [1], { row: 1, repeat: 7 });
        addTypeEachLine('arrow-down', [1], { column: 9, repeat: 7 });
        addTypeEachLine('arrow-right', [1], { row: 9, repeat: 7 });
        addTypeEachLine('arrow-up', [1], { column: 1, repeat: 7 });

        addTypeEachLine('arrow-down-right', [1], { column: 8 });
        addTypeEachLine('arrow-down-left', [8], { column: 9 });
        addTypeEachLine('arrow-up-left', [9], { column: 2 });
        addTypeEachLine('arrow-up-right', [2], { column: 1 });
    }

    Object.entries(tileIndex).forEach(([key, value]) => value.includes(edge ? path : index) && (type = key as TTileType));

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
            type: assignType(edge, index, path, vector),
            occupants: []
        };
    });
};

export default generateTiles;