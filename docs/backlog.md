# Backlog

## Features

### Pipeline
- Handle persistence with PipelineContext (sessionStorage, localStorage and cookies)

### Prompts
- Hints bellow hard to understand prompts (autocomplete, number and others). Use SelectPrompt's *select-navigation-hint* as a template
- Implement usePagination hook
- Implement BasePrompt
    - With custom input components
    - With custom logic on the input components
- Implement pagination on SelectPrompts

### Themes and Styling
#### SCSS
- Create .module.scss for the rest of the components

#### Themes
- Remove color references from scss. It must only come from the theme configs
- Themes must have a color palette and variables referencing it (terminal-background-color references neutral-100, for instance)
- Persist styles on localStorage
- Define default styles when persistent are lost
- Implement command to change specific theme variables (primary-color, background-color, etc)
- Implement command to change specific theme colors (blue, teal, etc)
- Implement command to change to other theme
- Implement command to create new theme

#### Animations
- Implement create terminal animation
- Implement delete terminal animation
- Implement prompt animations
- Implement action animations
- Implement output animations

### Commands
- Create a way to declare aliases for a command
- Implement default options, args and flags on the commandConfig
- Create auto-help generator based on default options, args and flags
- Create declarative documentation for default options/args/flags and show on auto-help
- Make auto-doc and auto-help required
- Implement command history to go back to previous used commands (with history limit parametrized)
  
### CI/CD
- Implement basic testing
- Implement automated linting (pre-commit/push?)
- Implement automated formatting (pre-commit/push?)
- Adjust makefile commands to upstart the dev server from clean slate
- Refactor Makefile to have all the essential commands and nothing else

## Fixes
- AppContext - Problem creating terminals when just deleted

## Spikes

