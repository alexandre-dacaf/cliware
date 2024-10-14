# Roadmap

## Sprints

### Sprint 1: Basic Structure and Prompt Management

  - Implement text editing features including:
    - Copy & paste functionality.
  - Implement `print()` on `Enter`:
    - Sends the input to be printed to the terminal, adding it to `OutputHistory`.

- Implement Prompt Chaining with `config.js`
  - Create a `StandbyPrompt` component to initiate in the terminal.
  - Create a `promptChain` object in `config.js`.
  - Define the entry point to be used in `StandbyPrompt` to initiate the chain.
  - Create a simple chain with two `TextPrompt` components.
  - Define in the `promptChain` object:
    - Type of prompt.
    - Key of the prompt.
    - Message of the prompt.
    - NextPrompt to be invoked.
    - Variables: `answer` and `previousAnswers`.
    - Methods: `print()`, `next()`.

### Sprint 2: Expand Prompt Chain and Create More Prompt Types

- Create Number Prompt
  - Develop a `NumberInput` component and integrate it into `NumberPrompt`.
  - Restrict non-numeric characters.
  - Define properties `max`, `min`, `step`, `float`, and `round` and implement them in the `promptChain` object.

- Create Select Prompt
  - Implement `handleInput` based solely on arrow keys and `Enter`.

- Create a More Complex Prompt Chain
  - Utilize 5+ prompts in the chain.
  - Implement conditional logic in the `next()` method.
  - Implement `back()` method to navigate to the previous prompt.
  - Implement `cancel()` method to terminate the prompt chain.