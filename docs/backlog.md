# Backlog


## Epic 1: Prompts

- [x] 🧩 **User Story 1.1 - As a dev, have all the different prompts and be able to create basic pipelines with them**
    - [x] 1.1.1 - Implement basic multiselect prompt
    - [x] 1.1.2 - Implement basic number prompt
    - [x] 1.1.3 - Implement basic autocomplete prompt
    - [x] 1.1.4 - Implement basic date prompt
    - [x] 1.1.5 - Implement basic list prompt
    - [x] 1.1.6 - Implement basic password prompt

- [ ] 🧩 **User Story 1.2 - As a dev, have advanced options and properties with the prompts**
    - [x] 1.2.1 - Implement *back()* function to rewind to previous prompt
    - [x] 1.2.2 - Implement *validate()* function to check and alert before submit
    - [x] 1.2.4 - Implement *default* answers on prompts
    - [x] 1.2.5 - Implement *required* property, which will probably be a simple type of validate()
    - [x] 1.2.6 - Implement *cancel()* function to exit to standy CommandInput
    - [x] 1.2.7 - Implement *hints* on Choices
    - [x] 1.2.8 - Implement *placeholders* on commands and prompts
    - [x] 1.2.9 - Implement *format()* function or pattern to (mask) input
    - [ ] 1.2.10 - Hints bellow hard to understand prompts (autocomplete, number and others). Use SelectPrompt's *select-navigation-hint* as a template


## Epic 2: Themes & Styling

- [ ] 🧩 **User Story 2.1 - As a dev, have a modularized and SASS/SCSS compliant styling/theming**
    - [ ] 2.1.1 - Install sass
    - [ ] 2.1.2 - Change .css to .scss and adjust
    - [ ] 2.1.3 - Create global styles and variables
    - [ ] 2.1.4 - Create .module.scss for the rest of the components

- [ ] 🧩 **User Story 2.2 - As a user, have a way of changing and persisting themes**
    - [ ] 2.2.1 - Persist styles on localStorage
    - [ ] 2.2.2 - Define default styles when persistent are lost
    - [ ] 2.2.3 - Implement command to change specific theme variables (primary-color, background-color, etc)

- [ ] 🧩 **User Story 2.3 - As a user, have nice animations/transitions**
    - [ ] 2.3.1 - Implement create terminal animation
    - [ ] 2.3.2 - Implement delete terminal animation
    - [ ] 2.3.3 - Implement prompt animations
    - [ ] 2.3.4 - Implement action animations
    - [ ] 2.3.5 - Implement output animations


## Epic 3: Commands & Actions

- [ ] 🧩 **User Story 3.1 - As a user, have easy help from commands, default options and aliases for commands**
    - [ ] 3.1.1 - Create a way to declare aliases for a command
    - [ ] 3.1.2 - Implement default options, args and flags on the commandConfig
    - [ ] 3.1.3 - Create auto-help generator based on default options, args and flags
    - [ ] 3.1.4 - Create declarative documentation for default options/args/flags and show on auto-help
    - [ ] 3.1.5 - Make auto-doc and auto-help required

- [ ] 🧩 **User Story 3.2 - As a user, have autocomplete on commands and default command options**
    - [x] 3.2.1 - Implement variable to keep track of available commands on CommandInput
    - [x] 3.2.2 - Change CommandInput to use the autocomplete logic
    - [ ] 3.2.3 - Implement command history to go back to previous used commands (with history limit parametrized)

- [ ] 🧩 **User Story 3.3 - As a dev, have terminal and global parameters that can be accessed by actionFunction**
    - [x] 3.3.1 - Find a way for actionFunctions to read and update app and terminal state
    - [x] 3.3.2 - On useTaskHandler, pass usePrinter as an argument to actionFunctions
    - [x] 3.3.3 - On useTaskHandler, pass app and terminal context to actionFunctions
    - [x] 3.3.4 - Create task stream/pipeline context to easily handle state and dispatch, and pass this context to actionFunction on useTaskHandler


## Epic 4: Outputs

- [ ] 🧩 **User Story 4.1 - As a dev, have multiple outputs for various use cases**
    - [ ] 4.1.1 - Implement card-like appearance for the inputs (prompts and command-input)
    - [ ] 4.1.2 - Implement card-like appearance for the groups of outputs related to a single command (adjust in terminal-history)
    - [ ] 4.1.3 - Make sure the terminal is always scrolling to the bottom
    - [ ] 4.1.4 - Implement basic printing with tables
    - [ ] 4.1.5 - Implement toast (upper corner or inline?)
    - [ ] 4.1.6 - Implement basic messages (sucess, error, alert, etc). Should they be persistent or transient? Toast or inline?
    - [ ] 4.1.7 - Implement progress bar
    - [ ] 4.1.8 - Implement JSON output
    - [ ] 4.1.9 - Implement spinner
    - [ ] 4.1.10 - Implement output to file (first csv, json and txt only)
    - [ ] 4.1.11 - Implement output to clipboard


## Epic 5: Refactoring

- [x] 🧩 **User Story 5.1 - As a dev, have more componentization of the huge components (App and Terminal - maybe more)**
    - [x] 5.1.2 - Create specific component to handle commands inside Terminal
    - [x] 5.1.3 - Create specific component to handle prompts inside Terminal
    - [x] 5.1.4 - Create specific component to handle actions inside Terminal
    - [x] 5.1.5 - Create specific component to handle outputs inside Terminal
    - [x] 5.1.6 - Create specific component to handle terminal history inside Terminal (maybe a form of output)
    - [x] 5.1.7 - Create specific component inside App to handle terminal switching, creating, deleting, etc

- [x] 🧩 **User Story 5.2 - As a dev, separate presentation and logic with custom hooks**
    - [x] 5.2.1 - Create custom hooks for all prompts
    - [x] 5.2.3 - Create custom hooks for the App

- [ ] 🧩 **User Story 5.3 - As a dev, I want all prompts to extend from a base prompt to make system development and maintenance easier**
    - [ ] 5.3.1 - Focus and blur
        - [ ] 5.3.1.1 - Base prompt must handle all focus and blur behaviours
        - [ ] 5.3.1.2 - Each prompt must pass which element must be focused
    - [ ] 5.3.2 - KeyDown events
        - [ ] 5.3.2.1 - Base prompt must handle keyDown events, with configuration of commands in each prompt
        - [ ] 5.3.2.2 - Each prompt must create an object configuring the keyDown events and behaviours and pass it to the base prompt
    - [ ] 5.3.3 - Rendering
        - [ ] 5.3.3.1 - Each prompt must use the base prompt, passing props and children to it
        - [ ] 5.3.3.2 - There must be simple components to be passed as children to the base prompt, like the select and autocomplete list, the date select spans, etc
    - [ ] 5.3.4 - Submit
        - [ ] 5.3.4.1 - Base prompt must usePromptSubmitter, making the submit function available to the prompts
        - [ ] 5.3.4.2 - Each prompt must create its own validate, clear, etc functions, passing it to the base prompt

- [ ] 🧩 **User Story 5.4 - As a dev, I want better lingo/domain language and better cohesion and structure**
    - [ ] 5.4.1 - Enhance nomenclature of output components (history entry, terminal history, display, etc)
    - [ ] 5.4.2 - Improve cohesion of usePrinter functions (break into more focused hooks)


## Epic 6: CI/CD

- [ ] 🧩 **User Story 6.1 - As a dev, have automated testing, linting and pre-commit/push handling**
    - [ ] 6.1.1 - Implement basic testing
    - [ ] 6.1.2 - Implement automated linting (pre-commit/push?)
    - [ ] 6.1.3 - Implement automated formatting (pre-commit/push?)
    
- [ ] 🧩 **User Story 6.2 - As a dev, have a reliable Makefile to bootstrap applications and handle various use cases**
    - [ ] 6.2.1 - Adjust makefile commands to upstart the dev server from clean slate
    - [ ] 6.2.2 - Refactor Makefile to have all the essential commands and nothing else

- [ ] 🧩 **User Story 6.3 - As a dev, have a reliable building process**


## Chores
- [x] Chr1 - Replace div-content-editables for inputs in prompts where it makes sense
- [x] Chr2 - Rename terminal-history (print-history) and transient-output (display)
- [x] Chr3 - Deal with enter when select is not multiselect (should select and submit)


## Spikes


## Bugs & Fixes
- [ ] Bug1 - Terminal create, delete and select is inconsistent.
    - [x] Bug1.1 - There shouldn't be less than 1 terminal
    - [x] Bug1.2 - Terminal select should use indexes, not ids
    - [x] Bug1.3 - Terminal create should get the biggest id and create id+1, on last index of array
    - [x] Bug1.4 - Terminal delete shouldn't happen when only one terminal (see Bug1.1)
    - [ ] Bug1.5 - When terminal delete, active or selected index should remain the same because the next terminal will take the deleted one's place

## To Be Defined (TBD)
- [ ] Tbd1 - Single base prompt component, with input types as children components
- [ ] Tbd2 - Scroll bottom when prompt is too long
- [ ] Tbd3 - Handle persistence with PipelineContext (sessionStorage, localStorage and cookies)