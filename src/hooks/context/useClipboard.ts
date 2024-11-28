import { Hooks } from 'types';
import useHistoryLogger from './useHistoryLogger';

const useClipboard = (): Hooks.UseClipboardMethods => {
    const { printSuccess, printError } = useHistoryLogger();

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            printSuccess('Texto copiado para a área de transferência!');
        } catch (error) {
            printError('Falha ao copiar para a área de transferência!');
        }
    };

    return {
        copyToClipboard,
    };
};

export default useClipboard;
