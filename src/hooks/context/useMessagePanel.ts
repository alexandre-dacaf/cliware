import { MessagePanel, Hooks } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';
import { generateSpinnerProps } from 'services';

const useMessagePanel = (): Hooks.UseMessagePanelMethods => {
    const { dispatch } = useContext(TerminalContext);

    const setDisplayText = (text: string) => {
        dispatch({ type: 'SET_DISPLAY_TEXT', payload: text });
    };

    const setDisplaySpinner = (config: MessagePanel.SpinnerConfig) => {
        const spinner = generateSpinnerProps(config);
        if (!spinner) return;

        dispatch({ type: 'SET_DISPLAY_SPINNER', payload: spinner });
    };

    const setProgressBarStyle = (style: MessagePanel.ProgressBarStyle | null) => {
        dispatch({ type: 'SET_PROGRESS_BAR_STYLE', payload: style });
    };

    const updateProgressBarPercentage = (percentage: number) => {
        dispatch({ type: 'UPDATE_PROGRESS_BAR_PERCENTAGE', payload: percentage });
    };

    const clearDisplay = () => {
        dispatch({ type: 'CLEAR_DISPLAY' });
    };

    return {
        setDisplayText,
        setDisplaySpinner,
        setProgressBarStyle,
        updateProgressBarPercentage,
        clearDisplay,
    };
};

export default useMessagePanel;
