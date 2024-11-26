import { DefaultSpinnerNames, GenerateSpinnerConfigProps, SpinnerProps } from 'types';

export const generateSpinnerConfig = (
    spinner?: GenerateSpinnerConfigProps
): SpinnerProps | null => {
    const spinners: Record<DefaultSpinnerNames, string[]> = {
        dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
        dots3: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
        dots4: ['⠄', '⠆', '⠇', '⠋', '⠙', '⠸', '⠰', '⠠', '⠰', '⠸', '⠙', '⠋', '⠇', '⠆'],
        dots5: [
            '⠋',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
        ],
        dots6: [
            '⠁',
            '⠉',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠤',
            '⠄',
            '⠄',
            '⠤',
            '⠴',
            '⠲',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠚',
            '⠙',
            '⠉',
            '⠁',
        ],
        dots7: [
            '⠈',
            '⠉',
            '⠋',
            '⠓',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠖',
            '⠦',
            '⠤',
            '⠠',
            '⠠',
            '⠤',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
            '⠉',
            '⠈',
        ],
        dots8: [
            '⠁',
            '⠁',
            '⠉',
            '⠙',
            '⠚',
            '⠒',
            '⠂',
            '⠂',
            '⠒',
            '⠲',
            '⠴',
            '⠤',
            '⠄',
            '⠄',
            '⠤',
            '⠠',
            '⠠',
            '⠤',
            '⠦',
            '⠖',
            '⠒',
            '⠐',
            '⠐',
            '⠒',
            '⠓',
            '⠋',
            '⠉',
            '⠈',
            '⠈',
        ],
        dots9: ['⣼', '⣹', '⢻', '⠿', '⡟', '⣏', '⣧', '⣶'],
        line: ['-', '\\', '|', '/'],
        arc: ['◜', '◠', '◝', '◞', '◡', '◟'],
        arc2: ['\uEE06', '\uEE07', '\uEE08', '\uEE09', '\uEE0A', '\uEE0B'],
        circleHalves: ['◐', '◓', '◑', '◒'],
    };

    if (!spinner) {
        return null;
    }

    const defaulInterval = 80;

    if (spinner.frames) {
        // Uses custom frames if provided
        return {
            frames: spinner.frames,
            interval: spinner.interval ?? defaulInterval,
        };
    }

    if (spinner.name && spinners[spinner.name]) {
        // Finds frames by name
        return {
            frames: spinners[spinner.name],
            interval: spinner.interval ?? defaulInterval,
        };
    }

    return null;
};
