type PromptVariation = "TextPrompt";

export interface PromptConfig {
    [key: string]: {
        variation: PromptVariation;
        message: string;
        next: () => string | null;
    };
}
