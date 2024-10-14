# Roadmap

## Sprints

### Sprint 1: Basic Structure and Prompt Management

- Implement Focus Management in Terminals
  - Do not use `tabindex`; adopt a purely programmatic approach.
  - Utilize `ctrl+tab` and `ctrl+shift+tab` (prevent default behavior).
  - Manage user input keys:
    - Inputs should be sent only to the active terminal.
    - Terminal handles keys, typically forwarding them to the current prompt.

- Implement Text Prompt That Simply Prints What Was Typed
  - Create a `TextInput` component based on `<span>` instead of an `<input>` tag.
  - Use `'>'` as the message prefix before the input span.
  - Receive typed keys from the terminal.
  - Implement text editing features including:
    - Insertion and deletion.
    - Selection with `shift`.
    - Word navigation with `ctrl`.
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