import { defaultTheme } from 'styles/theme';
import { Color } from 'types';

export const getColorValue = (color: Color.ColorName) => {
    const colorPalette = defaultTheme.palette;
    const colorName = color;

    return colorPalette[colorName];
};
