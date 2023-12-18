import { getRemainingColors } from "@/components/elements/menu/PlayerCard";
import { TPlayer } from "@/components/reducers/playersReducer";

const players: Partial<TPlayer>[] = [
    { id: '1', color: 'red' },
    { id: '2', color: 'blue' },
] as TPlayer[];

const colors: string[] = ['red', 'blue', 'green', 'yellow', 'purple'];

describe('getRemainingColors function', () => {
    it('should return an array of colors not used by any players', () => {
        const remainingColors = getRemainingColors(players as TPlayer[], colors);
        const unusedColors = ['green', 'yellow', 'purple'];
        expect(remainingColors).toEqual(unusedColors);
    });

    it('should return an empty array if all colors are used by players', () => {
        const allUsedColorsPlayers: Partial<TPlayer>[] = colors.map((color, i) => (
            { id: i.toString(), color }
        ));

        const remainingColors = getRemainingColors(allUsedColorsPlayers as TPlayer[], colors);
        expect(remainingColors).toEqual([]);
    });
});
