export const changeTerminalColumns = (newColumnCount: number) => {
    const event = new CustomEvent("changeTerminalColumns", {
        detail: { columns: newColumnCount },
    });
    window.dispatchEvent(event);
};
