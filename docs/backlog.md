# Backlog

## Epic 1: Prompt Component

### Types
- Text
- Password
- Confirm
- List
- Toggle
- Select
- Checkbox
- Autocomplete
- Date

### Properties
- `key`: Unique identifier for the prompt.
- `answer`: The user's response to the prompt.
- `previousAnswers`: List of all previous answers in the current chain.
- `message`: The message displayed to the user.
- `default`: Default value for the prompt, if applicable.
- `nextPrompt`: The next prompt to be invoked after this one.
- `required`: Indicates whether the prompt requires an answer (cannot be skipped).

### Methods
- `back()`: Navigate to the previous prompt in the chain.
- `next()`: Proceed to the next prompt in the chain.
- `print()`: Output a message or response.
- `handleInput()`: Capture and manage user input specific to the prompt type.
- `validate()`: Ensure the user's response meets defined criteria.
- `format()`: Format the input or output as needed.
- `onChange()`: Trigger actions when the input changes.
- `onRender()`: Trigger actions when the prompt is rendered.
- `cancel()`: Terminate the current prompt chain.