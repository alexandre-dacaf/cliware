# Concepts

## Questions

### What is a Prompt?

A **Prompt** is a text printed in the terminal, waiting for user input. Each prompt type has a specific format for both how the text is displayed and what kind of input is expected.

- **Examples of Prompt Types**:
    - **Select Prompt**: Only accepts arrow keys (up and down), space to select, and enter to finalize.
    - **Input Prompt**: Provides a text field for the user to type into.

After a user responds to the prompt, it takes action:
- **Possible actions**:
    - It can simply print a message.
    - It can print and move on to another prompt.

The **Terminal** component, as the parent of the prompt, is responsible for printing the message and deciding which prompt to call next.

### Does a Prompt have a return value?

Yes, a prompt has a return structure that allows it to control what happens after it is answered. This return object can look like this:

```js
{
    print?: string,      // Optional message to be printed by the terminal
    nextPrompt?: Prompt  // Optional next prompt to be called
}
```

- If a `print` is provided, the terminal will print it.
- If a `nextPrompt` is provided, the terminal will invoke it.
    - If no `nextPrompt` is specified, the terminal will call the **StandbyPrompt** by default (a state of waiting for new commands).

### What if a prompt behaves like a form?

In cases where a prompt behaves like a form, it collects inputs from multiple child prompts and passes them as parameters to a single function.

- The prompt uses the print function provided as a prop by its parent terminal.
- It is responsible for calling child prompts, if applicable.
- At the end of the sequence, it compiles the responses from its child prompts and sends them as parameters to its function.

### What if a prompt needs to set global variables?

When a prompt needs to set global variables, it uses **Svelte stores** to manage global state. This allows prompts to share information or react to changes across the entire application.

### What if a prompt requires the previous prompt's answer?

A prompt can navigate through a sequence of actions, which we can refer to as a **Prompt Chain**. Each prompt in this chain is connected and can perform up to four main actions:

1. Call the next prompt.
2. Go back to the previous prompt.
3. Be the last prompt, ending the chain and returning to the **StandbyPrompt**.
4. Cancel the chain entirely, also returning to the **StandbyPrompt**.

#### Key Questions:
- **Does the prompt chain retain all the answers given?**  
  **Yes**, it stores all responses within that chain.
  
- **If a prompt returns to the previous one, does it discard the last response?**  
  **Yes**, the most recent response will be removed from the chain when going back.

#### Prompt Properties:

Each prompt should have the following properties:

- `key`: The unique identifier for the prompt.
- `answer`: The answer provided by the user.
- `previousAnswers`: The list of all previous answers in the current chain.
- `message`: The message displayed to the user.
- `default`: A default value for the prompt, if applicable.
- `nextPrompt`: The prompt to be called next.
- `required`: Indicates whether the prompt requires an answer (i.e., cannot be skipped).

#### Prompt Methods:

Each prompt can have the following methods, some of which may be passed as props by the terminal:

- `back()`: Go back to the previous prompt.
- `next()`: Proceed to the next prompt.
- `stdout()`: Output the result or a message.
- `stdin()`: Capture input, which may vary depending on the prompt type (e.g., arrows for selection, text for input).
- `validate()`: Validate the user's response.
- `format()`: Format the input or output as needed.
- `onChange()`: Triggered when the input changes.
- `onRender()`: Triggered when the prompt is rendered.
- `cancel()`: Cancel the current prompt chain.

### What are the different types of Prompts?

Each prompt type has a specific input method and output format. Here's a list of prompt types:

1. **Text Prompt**: Used for free-form text input.
2. **Password Prompt**: Accepts hidden input (useful for passwords or sensitive data).
3. **Number Prompt**:
    - Supports properties like `max`, `min`, `step`, `float`, and `round` for controlling numeric input.
    - You can type or increse/decrease with arrow keys.
4. **Confirm Prompt**: Offers a simple "yes" or "no" choice.
5. **List Prompt**: Receives input as texts, returns an array of items divided by the separator.
    - **Separator**: Determines how to split the input string.
6. **Toggle Prompt**: Offers a boolean choice, typically toggling between two options.
7. **Select Prompt**: Allows the user to select one choice from a list.
    - Choices are structured as:
    ```js
    [{ value?: string, label: string, selected?: boolean, disabled?: boolean }, ...]
    ```
8. **Checkbox Prompt**: Allows the user to select multiple choices from a list.
    - The structure of choices is similar to the Select prompt.
9. **Autocomplete Prompt**: Provides a list of suggestions while the user types, allowing for autocompletion.
    - Choices follow the same structure as the Select prompt.
10. **Date Prompt**: Allows the user to input or select a date.
    - May use a mask (e.g., `dd/mm/yyyy` or similar).

## Let's revisit the concepts so we can revaluate what needs to be done
- We've hit a brick wall on the custom terminal idea. It cannot deal with all the necessary functions, mainly pasting text
- Given this, we now have to go back to the <div contenteditable="true"> ideia. The only problem is dealing is element focus
- This div, which we'll still call TextInput, must receive a real event focus, not a simulated one. So all input and keydown events will happen in it
- How can we deal with changes to another terminal and/or global hotkeys? One way is to use the esc key to blur focus on the TextInput, giving focus back to the App (terminal container)
- We can have visual indication showing the input is active and, when pressed esc, removing this visual indication (along with the focus being given to the App)
- We may use tab and shift+tab to switch between terminals, and enter to access the input of a terminal
- Or, better yet, we can switch between terminals using the arrow keys, access a terminal with enter or space, delete a terminal with delete
- Accessing the terminal gives the visual indication back to the input. Each input type may have a different way of showing it's active.
- So what are the next steps?
    - First, adjust the TextInput to be a simple <div contenteditable="true">
    - Adjust the way focus is passed from the App > Terminal > TextInput and back (no switching between terminals yet)
    - Deal with input and enter on the TextInput
    - Adjust styling of the TextInput
    - Deal with key presses when the app is focused (switch terminals, access terminal, delete terminal)
        - Terminal creation and column altering will be dealt with later
    - Then, we can move to implementing the print function, and later the prompt chaining basics
- Remember: focus on the basics! We need sprint 1 to end with v0.1.0, where we'll have a functioning interface with basic navigation, basic prompt chaining with text inputs only and basic configuration with the config.js file.