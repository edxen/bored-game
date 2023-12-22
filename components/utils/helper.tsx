import config from "../config";
const columns = config.tiles?.size.columns ?? 11;

/**
     * Retrieves the same side column index based on the provided 'index' and 'step'.
     * @param {number} index - The index value.
     * @param {number} step - The step value.
     * @returns {number} - The calculated column index.
 */
export const getSameSideColumn = (index: number, step: number): number => {
    return (columns * index) - index + step;
};

export const getEdge = ({ row, rows, column, columns }: { [key: string]: number; }) => {
    const top = () => row === 0;
    const right = () => column === columns - 1 && row !== rows - 1;
    const bottom = () => row === rows - 1 && column !== 0;
    const left = () => column === 0;
    const all = () => top() || right() || bottom() || left();

    return { top, right, bottom, left, all };
};

export const getPath = (vector: { [key: string]: number; }): number => {
    const { row, rows, column, columns } = vector;

    switch (true) {
        case getEdge(vector).top(): return column + 1;
        case getEdge(vector).right(): return columns + row;
        case getEdge(vector).bottom(): return ((columns * 2) + rows) - column - 2;
        case getEdge(vector).left(): return (columns * 2) + (rows * 2) - row - 3;
    }
    return 0;
};