# Roadmap

## Sprint 4: Advanced Prompts and Commands

> Version 0.4.0

- [ ] 1.2.1 - Implement *back()* function to rewind to previous prompt
- [ ] 1.2.2 - Implement *validate()* function to check and alert before submit
- [ ] 1.2.4 - Implement *default* answers on prompts
- [ ] 1.2.5 - Implement *required* property, which will probably be a simple type of validate()
- [ ] 1.2.6 - Implement *cancel()* function to exit to standy CommandInput
- [ ] 1.2.7 - Implement *hints* on Choices
- [ ] 1.2.8 - Implement *placeholders* on commands and prompts
- [ ] 1.2.9 - Implement *mask()* function or pattern to (mask) input
- [x] 3.2.1 - Implement variable to keep track of available commands on CommandInput
- [x] 3.2.2 - Change CommandInput to use the autocomplete logic
- [ ] 3.3.1 - Find a way for actionFunctions to read and update app and terminal state
    - [ ] Start with `cols` command
- [x] Ch2 - Rename terminal-history (print-history) and transient-output (display)
    - [x] Rename related functions on usePrinter and its uses

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
- [x] Ch1 - Replace div-content-editables for inputs in prompts where it makes sense


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