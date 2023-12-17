import { useSelector } from 'react-redux';
import getData from '../components/hooks/getData';
import { TTile } from '@/components/reducers/tilesReducer';

jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
}));

describe('getData custom hook: getTile', () => {
    type MockState = {
        tiles: Partial<TTile>[];
    };

    const mockState = {
        tiles: [
            { path: 1 },
            { path: 5 },
            { path: 8 },
            { path: 12 },
        ],
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (useSelector as jest.Mock).mockImplementation((selector: (state: MockState) => any) => selector(mockState));
    });

    it('should return the correct tile when a valid path is provided', () => {
        const { getTile } = getData();

        const path = 1;
        const result = getTile({ path });
        expect(result.path).toEqual(path);
    });

    it('should throw an error when an invalid path is provided', () => {
        const { getTile } = getData();
        const path = 0;
        expect(() => getTile({ path })).toThrow(`tile with path ${path} not found`);
    });
});
