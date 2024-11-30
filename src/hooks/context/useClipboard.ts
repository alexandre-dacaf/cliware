import { Hooks } from 'types';
import useHistoryLogger from './useHistoryLogger';

const useClipboard = (): Hooks.UseClipboardMethods => {
    const { logSuccess, logError } = useHistoryLogger();

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            logSuccess('Texto copiado para a área de transferência!');
        } catch (error) {
            logError('Falha ao copiar para a área de transferência!');
        }
    };

    return {
        copyToClipboard,
    };
};

export default useClipboard;
