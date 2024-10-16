import { PromptConfig } from "../types/prompt";

export const promptChainConfig: PromptConfig = {
    name: {
        variation: "TextPrompt",
        message: "What's your name?",
        next: () => "age",
    },
    age: {
        variation: "TextPrompt",
        message: "How old are you?",
        next: () => "city",
    },
    city: {
        variation: "TextPrompt",
        message: "Where do you live?",
        next: () => null,
    },
};
