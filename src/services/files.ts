export const getExtensionFromMimeType = (mimeType: string): string => {
    const mimeToExtension: Record<string, string> = {
        'text/plain': 'txt',
        'text/csv': 'csv',
        'application/json': 'json',
        // Add more as needed
    };

    return mimeToExtension[mimeType] || 'txt'; // Fallback to txt
};

export const hasValidExtension = (filename: string, extension: string): boolean => {
    return filename.toLowerCase().endsWith(`.${extension.toLowerCase()}`);
};
