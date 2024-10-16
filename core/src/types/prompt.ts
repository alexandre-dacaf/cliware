type PromptVariant = "text";

export interface PromptConfig {
    [key: string]: {
        variant: PromptVariant;
        message: string;
        next: () => string | null;
    };
}
