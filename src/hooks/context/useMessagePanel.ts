import { MessagePanel, Hooks, Content } from 'types';
import { TerminalContext } from 'context/TerminalContext';
import { useContext } from 'react';

const useMessagePanel = (): Hooks.UseMessagePanelMethods => {
    const { dispatch } = useContext(TerminalContext);

    const setMessageText = (richText: Content.Text.RichText | null) => {
        dispatch({ type: 'SET_MESSAGE_TEXT', payload: richText });
    };

    const setMessageAlert = (text: string) => {
        setMessageText({ color: 'yellow', text });
    };

    const setSpinner = (spinner: MessagePanel.Spinner | null) => {
        dispatch({ type: 'SET_SPINNER', payload: spinner });
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
        setMessageText,
        setMessageAlert,
        setSpinner,
        setProgressBarStyle,
        updateProgressBarPercentage,
        clearDisplay,
    };
};

export default useMessagePanel;
