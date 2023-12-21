import config from "../config";
const { columns } = config.tiles.size;

/**
     * Retrieves the same side column index based on the provided 'index' and 'step'.
     * @param {number} index - The index value.
     * @param {number} step - The step value.
     * @returns {number} - The calculated column index.
 */
export const getSameSideColumn = (index: number, step: number): number => {
    return (columns * index) - index + step;
};