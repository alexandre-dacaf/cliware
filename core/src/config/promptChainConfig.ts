import { PromptConfig } from "../types/prompt";

export const promptChainConfig: PromptConfig = {
    name: {
        variant: "text",
        message: "What's your name?",
        next: () => "age",
    },
    age: {
        variant: "text",
        message: "How old are you?",
        next: () => "city",
    },
    city: {
        variant: "text",
        message: "Where do you live?",
        next: () => null,
    },
};
