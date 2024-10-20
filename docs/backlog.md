# Backlog

## Epic 1: Prompts

- **User Story 1.1 - As a dev, have all the different prompts and be able to create basic pipelines with them**
    - 1.1.1 - Implement basic multiselect prompt
    - 1.1.2 - Implement basic number prompt
    - 1.1.3 - Implement basic autocomplete prompt
    - 1.1.4 - Implement basic date prompt
    - 1.1.5 - Implement basic list prompt
    - 1.1.6 - Implement basic password prompt

- **User Story 1.2 - As a dev, have advanced options and properties with the prompts**
    - 1.2.1 - Implement *back()* function to rewind to previous prompt
    - 1.2.2 - Implement *validate()* function to check and alert before submit
    - 1.2.3 - Implement *format()* function to re-render (mask) prompt on input
    - 1.2.4 - Implement *default* answers on prompts
    - 1.2.5 - Implement *required* property, which will probably be a simple type of validate()
    - 1.2.6 - Implement *cancel()* function to exit to standy CommandInput
    
## Epic 2: Themes & Styling

- **User Story 2.1 - As a dev, have a modularized and SASS/SCSS compliant styling/theming**
    - 2.1.1 - Install sass
    - 2.1.2 - Change .css to .scss and adjust
    - 2.1.3 - Create global styles and variables
    - 2.1.4 - Create .module.scss for the rest of the components

- **User Story 2.2 - As a user, have a way of changing and persisting themes**
    - 2.2.1 - Persist styles on localStorage
    - 2.2.2 - Define default styles when persistent are lost
    - 2.2.3 - Implement command to change specific theme variables (primary-color, background-color, etc)

- **User Story 2.3 - As a user, have nice animations/transitions**
    - 2.3.1 - Implement create terminal animation
    - 2.3.2 - Implement delete terminal animation
    - 2.3.3 - Implement prompt animations
    - 2.3.4 - Implement action animations
    - 2.3.5 - Implement output animations

## Epic 3: Commands

- **User Story 3.1 - As a user, have easy help from commands, default options and aliases for commands**
    - 3.1.1 - Create a way to declare aliases for a command
    - 3.1.2 - Implement default options, args and flags on the commandConfig
    - 3.1.3 - Create auto-help generator based on default options, args and flags
    - 3.1.4 - Create declarative documentation for default options/args/flags and show on auto-help
    - 3.1.5 - Make auto-doc and auto-help required

- **User Story 3.2 - As a user, have autocomplete on commands and default command options**

## Epic 4: Outputs

- **User Story 4.1 - As a dev, have a centralized way of handling with outputs (much like PromptComponent centralizes prompt handling)**

## Epic 5: Refactoring

- **User Story 5.1 - As a dev, have more componentization of the huge components (App and Terminal - maybe more)**
    - 5.1.1 - Create custom hooks to handle simple logic
    - 5.1.2 - Create specific component to handle commands inside Terminal
    - 5.1.3 - Create specific component to handle prompts inside Terminal
    - 5.1.4 - Create specific component to handle actions inside Terminal
    - 5.1.5 - Create specific component to handle outputs inside Terminal
    - 5.1.6 - Create specific component to handle terminal history inside Terminal (maybe a form of output)
    - 5.1.7 - Create specific component inside App to handle terminal switching, creating, deleting, etc

## Epic 6: CI/CD

- **User Story 6.1 - As a dev, have automated testing, linting and pre-commit/push handling**
    - 6.1.1 - Implement basic testing
    - 6.1.2 - Implement automated linting (pre-commit/push?)
    - 6.1.3 - Implement automated formatting (pre-commit/push?)
    
- **User Story 6.2 - As a dev, have a reliable Makefile to bootstrap applications and handle various use cases**
    - 6.2.1 - Adjust makefile commands to upstart the dev server from clean slate
    - 6.2.2 - Refactor Makefile to have all the essential commands and nothing else

- **User Story 6.3 - As a dev, have a reliable building process**