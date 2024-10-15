import type { SvelteComponent } from 'svelte';
import TextPrompt from '../components/prompts/TextPrompt.svelte';


export interface PromptResult {
    print?: string;       
    nextPrompt?: Prompt;  
}


export interface Prompt {
    key: string;                          
    message: string;                      
    default?: any;                        
    required: boolean;                    
    component: typeof SvelteComponent;    
    onSubmit: (answer: any, previousAnswers: any[]) => PromptResult; 
    previousAnswers?: any[];              
}



export const initialPrompt: Prompt = {
    key: 'welcome',
    message: 'Welcome to Cliware! What\'s your name?',
    required: true,
    component: TextPrompt,
    onSubmit: (answer, previousAnswers) => {
        return {
            print: `Hello, ${answer}!`,
            nextPrompt: {
                key: 'age',
                message: 'How old are you?',
                required: true,
                component: TextPrompt,
                onSubmit: (age, prev) => {
                    return {
                        print: `You are ${age} years old.`,
                        
                    };
                },
            },
        };
    },
};

