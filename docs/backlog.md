# Backlog

## Epic 1: Prompts

User Story 1.1 - 

As a dev, have all the different prompts and be able to create basic pipelines with them
    Implement basic multiselect prompt
    Implement basic number prompt
    Implement basic autocomplete prompt
    Implement basic date prompt
    Implement basic list prompt
    Implement basic password prompt

As a dev, have advanced options and properties with the prompts
    Implement *back()* function to rewind to previous prompt
    Implement *validate()* function to check and alert before submit
    Implement *format()* function to re-render (mask) prompt on input
    Implement *default* answers on prompts
    Implement *required* property, which will probably be a simple type of validate()
    Implement *cancel()* function to exit to standy CommandInput
    
## Epic 2: Themes & Styling

As a dev, have a modularized and SASS/SCSS compliant styling/theming
    Install sass
    Change .css to .scss and adjust
    Create global styles and variables
    Create .module.scss for the rest of the components

As a user, have a way of changing and persisting themes
    Persist styles on localStorage
    Define default styles when persistent are lost
    Implement command to change specific theme variables (primary-color, background-color, etc)

As a user, have nice animations/transitions
    Implement create terminal animation
    Implement delete terminal animation
    Implement prompt animations
    Implement action animations
    Implement output animations

## Epic 3: Commands

As a user, have easy help from commands, default options and aliases for commands
    Create a way to declare aliases for a command
    Implement default options, args and flags on the commandConfig
    Create auto-help generator based on default options, args and flags
    Create declarative documentation for default options/args/flags and show on auto-help
    Make auto-doc and auto-help required

As a user, have autocomplete on commands and default command options

## Epic 4: Outputs

As a dev, have a centralized way of handling with outputs (much like PromptComponent centralizes prompt handling)

## Epic 5: Refactoring

As a dev, have more componentization of the huge components (App and Terminal - maybe more)
    Create custom hooks to handle simple logic
    Create specific component to handle commands inside Terminal
    Create specific component to handle prompts inside Terminal
    Create specific component to handle actions inside Terminal
    Create specific component to handle outputs inside Terminal
    Create specific component to handle terminal history inside Terminal (maybe a form of output)
    Create specific component inside App to handle terminal switching, creating, deleting, etc

## Epic 6: CI/CD

As a dev, have automated testing, linting and pre-commit/push handling
    Implement basic testing
    Implement automated linting (pre-commit/push?)
    Implement automated formatting (pre-commit/push?)
    
As a dev, have a reliable Makefile to bootstrap applications and handle various use cases
    Adjust makefile commands to upstart the dev server from clean slate
    Refactor Makefile to have all the essential commands and nothing else

As a dev, have a reliable building process