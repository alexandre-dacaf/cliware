# Roadmap

## Sprint 5: Advanced Outputs

> Version 0.5.0
> 4.1.6 - Implement basic messages (sucess, error, alert, etc)

- [x] 4.1.1 - Implement card-like appearance for the inputs (prompts and command-input)
- [x] 4.1.2 - Implement card-like appearance for the groups of outputs related to a single command (adjust in terminal-history)
- [x] 4.1.3 - Make sure the terminal is always scrolling to the bottom
- [x] 4.1.4 - Implement basic printing with tables
- [x] 4.1.6 - Implement basic messages (sucess, error, alert, etc). Should they be persistent or transient? Toast or inline?
- [ ] 4.1.7 - Implement progress bar
- [x] 4.1.8 - Implement JSON output
- [x] 4.1.9 - Implement spinner
- [x] 4.1.10 - Implement output to file (first csv, json and txt only)
- [x] 4.1.11 - Implement output to clipboard

### Extras:
- [x] Ext1 - Update the color palette to have all the colors needed
- [x] Ext2 - Change output types to represent colors, not use cases (green, not sucess. Devs should decide what each color means)
- [ ] Ext3 - Enhance nomenclature of output components (history entry, terminal history, display, etc)
- [ ] Ext4 - Allow mouse select of outputs? If so, make it.
- [ ] Ext5 - Block space action on simple select (use only enter)
- [ ] Ext6 - Improve cohesion of usePrinter functions (break into more focused hooks)

### Obsolete
- 4.1.5 - Implement toast (upper corner or inline?)

## Sprint 4: Advanced Prompts and Commands

> Version 0.4.0

- [x] 1.2.1 - Implement *back()* function to rewind to previous prompt
- [x] 1.2.2 - Implement *validate()* function to check and alert before submit
- [x] 1.2.4 - Implement *default* answers on prompts
- [x] 1.2.5 - Implement *required* property, which will probably be a simple type of validate()
- [x] 1.2.6 - Implement *cancel()* (renamed abort) function to exit to standy CommandInput
- [x] 1.2.7 - Implement *hints* on Choices
- [x] 1.2.8 - Implement *placeholders* on commands and prompts
- [x] 1.2.9 - Implement *mask()* function or pattern to (mask) input
- [x] 3.3.1 - Find a way for actionFunctions to read and update app and terminal state
- [x] 3.3.2 - On useTaskHandler, pass usePrinter as an argument to actionFunctions
- [x] 3.3.3 - On useTaskHandler, pass app and terminal context to actionFunctions
- [x] 3.3.4 - Create task stream/pipeline context to easily handle state and dispatch, and pass this context to actionFunction on useTaskHandler
- [x] 3.2.1 - Implement variable to keep track of available commands on CommandInput
- [x] 3.2.2 - Change CommandInput to use the autocomplete logic
- [x] Chr2 - Rename terminal-history (print-history) and transient-output (display)
    - [x] Rename related functions on usePrinter and its uses
- [x] Chr3 - Deal with enter when select is not multiselect (should select and submit)

## Sprint 3: Refactor and formatting

> Version 0.3.0

- [x] 5.1.2 - Create specific component to handle commands inside Terminal
- [x] 5.1.3 - Create specific component to handle prompts inside Terminal
- [x] 5.1.4 - Create specific component to handle actions inside Terminal
- [x] 5.1.5 - Create specific component to handle outputs inside Terminal
- [x] 5.1.6 - Create specific component to handle terminal history inside Terminal (maybe a form of output)
- [x] 5.1.7 - Create specific component inside App to handle terminal switching, creating, deleting, etc
- [x] 5.2.1 - Create custom hooks for all prompts
- [x] 5.2.3 - Create custom hooks for the App
- [x] Chr1 - Replace div-content-editables for inputs in prompts where it makes sense


## Sprint 2: All Prompt Types

> Version 0.2.0

- [x] 1.1.6 - Implement basic password prompt
- [x] 1.1.3 - Implement basic autocomplete prompt
- [x] Implement blur and escape on prompts
- [x] 1.1.4 - Implement basic date prompt
- [x] 1.1.5 - Implement basic list prompt
- [x] 1.1.1 - Implement basic multiselect prompt
- [x] 1.1.2 - Implement basic number prompt

## Sprint 1: Basic Structure and Prompt Management

> Version 0.1.0

- [x] Delete terminal via command