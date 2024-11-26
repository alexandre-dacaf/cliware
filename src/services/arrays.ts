export const ensureArray = <T>(input: T | T[]): T[] => {
    return Array.isArray(input) ? input : [input];
};
