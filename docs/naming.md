## Components
- App
    - Terminal
        - History
            - ArchivedHistoryBlock
                - HistoryEntry
        - CommandHub
            - ActiveHistoryBlock
                - HistoryEntry
            - Console
                - IdleConsole
                - PromptConsole
            - MessagePanel
                - Spinner
                - Message
                - ProgressBar

## Hooks
- Prompts
    - use\[PromptName\]
- Printer (usePrinter, replaced by:)
    - useMessagePanel
        - useMessageText
        - useMessageSpinner
        - useMessageProgressBar
    - useHistoryLogger (logText, logJSON, logTable, etc)
    - useClipboard
    - useFileDownloader
- Misc
    - useHandleKeyDown (?)
    - usePagination
    - useKeyboardNavigation

## Types
Blueprint {
    [command: string]: Command;
}
    Command {
        entrypoint: string;
        pipeline: Pipeline;
    }
        Pipeline {
            [taskKey: TaskKey]: Task;
        }
            Task = PromptTask | ActionTask;
                PromptTask =
                    | TextPrompt
                    | TogglePrompt
                    | SelectPrompt
                    | MultiselectPrompt
                    | NumberPrompt
                    | ListPrompt
                    | DatePrompt
                    | AutoCompletePrompt
                    | PasswordPrompt;
                ActionTask extends BaseTask {
                    type: 'action';
                    actionFunction: ActionFunction;
                }
                    ActionFunction = (context: PipelineContext) => Promise<any> | any;
                        PipelineContext {
                            currentTaskKey: TaskKey;
                            taskBreadcrumbs: TaskKey[];
                            pipelineData: PipelineData;
                            pipeline: Pipeline;
                            commandArgs: CommandArgs | null;
                            printer: PrinterInterface;
                            appDispatcher: AppDispatcherInterface;
                        }
                            TaskKey = string;
                            PipelineData {
                                [taskKey: TaskKey]: any;
                            }
                            Pipeline {
                                [taskKey: TaskKey]: Task;
                            }
                            CommandArgs {
                                baseCommand: string;
                                args: string[];
                                options: { [key: string]: string | string[] | boolean };
                                flags: string[];
                            }

HistoryBlock: {
    id: string;
    entries: HistoryEntry | HistoryEntry[]
}
    HistoryEntry = RichTextEntry | JsonEntry | TableEntry
        RichTextEntry extends BaseHistoryEntry {
            type: 'rich-text';
            content: TextSpan | TextSpan[];
        }
        JsonEntry extends BaseHistoryEntry {
            type: 'json';
            content: object;
        }
        TableHistoryEntry extends BaseHistoryEntry {
            type: 'table';
            content: TableContent;
        }
            TableContent = {
                columns: TableColumn[];
                data: TableData[];
            };
                TableColumn = {
                    key: string;
                    header: string;
                };
                TableData = Record<string, any>;

MessagePanel {
    spinner: Spinner
    message: RichTextLine
    progressBar: ProgressBar
}
    Spinner {
        name: SpinnerName
        interval: number
        color: ColorName
    }
        SpinnerName: 'dots' | 'dots2' | 'dots3' // etc
    ProgressBar {
        percentage: number
        color: ColorName
    }




RichTextLine: RichTextSpan | RichTextSpan[]
    RichTextSpan: {
        color: ColorName,
        text: string
    }

ColorPalette: Record<ColorName, string>
    ColorName: 'blue' | 'red' | 'green' // etc