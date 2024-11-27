import { DefaultSpinnerNames, SpinnerConfig, SpinnerProps } from 'types';

export const generateSpinnerProps = (spinner?: SpinnerConfig): SpinnerProps | undefined => {
    const spinners: Record<DefaultSpinnerNames, string[]> = {
        dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
        dots2: ['⣾', '⣽', '⣻', '⢿', '⡿', '⣟', '⣯', '⣷'],
        dots3: ['⠋', '⠙', '⠚', '⠞', '⠖', '⠦', '⠴', '⠲', '⠳', '⠓'],
        dots4: ['⠄', '⠆', '⠇', '⠋', '⠙', '⠸', '⠰', '⠠', '⠰', '⠸', '⠙', '⠋', '⠇', '⠆'],
        dots5: ['⠋', '⠙', '⠚', '⠒', '⠂', '⠂', '⠒', '⠲', '⠴', '⠦', '⠖', '⠒', '⠐', '⠐', '⠒', '⠓', '⠋'],
        dots6: ['⠁', '⠉', '⠙', '⠚', '⠒', '⠂', '⠂', '⠒', '⠲', '⠴', '⠤', '⠄', '⠄', '⠤', '⠴', '⠲', '⠒', '⠂', '⠂', '⠒', '⠚', '⠙', '⠉', '⠁'],
        dots7: ['⠈', '⠉', '⠋', '⠓', '⠒', '⠐', '⠐', '⠒', '⠖', '⠦', '⠤', '⠠', '⠠', '⠤', '⠦', '⠖', '⠒', '⠐', '⠐', '⠒', '⠓', '⠋', '⠉', '⠈'],
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
        circleHalves: ['◐', '◓', '◑', '◒'],
    };

    if (!spinner) {
        return;
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

    return;
};
