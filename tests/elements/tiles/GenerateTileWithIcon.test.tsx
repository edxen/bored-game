import React from 'react';
import '@testing-library/jest-dom/';
import { render } from '@testing-library/react';
import GenerateTileWithIcon from '@/components/elements/tiles/GenerateTileWithIcon';

describe('GenerateTileWithIcon', () => {
    const mockIconsList = {
        portal: 'wormhole',
    };

    it('renders an image when type exists in iconsList', () => {
        const { container } = render(
            <GenerateTileWithIcon type="portal" iconsListRef={mockIconsList} />
        );
        const imageElement = container.querySelector('img');
        expect(imageElement).toBeInTheDocument();
    });

    it('renders null when type does not exist in iconsList', () => {
        const consoleErrorSpy = jest.spyOn(console, 'error');
        consoleErrorSpy.mockImplementation(() => { });

        const type = 'unknown' as any;

        const { container } = render(
            <GenerateTileWithIcon type={type} iconsListRef={mockIconsList} />
        );
        const imageElement = container.querySelector('img');
        expect(imageElement).not.toBeInTheDocument();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining(`icon not found for type: ${type}`)
        );
        consoleErrorSpy.mockRestore();
    });
});