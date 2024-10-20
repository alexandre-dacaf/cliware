export const getDigitsBeforeCaret = (element: HTMLElement) => {
    const selection = window.getSelection();
    let digitsBeforeCaret = 0;

    if (selection && selection.rangeCount > 0) {
        // Create a range based on the current selection, and clone it to avoid modifying the original
        const range = selection.getRangeAt(0).cloneRange();
        range.selectNodeContents(element); // Set range to cover all contents of the element

        // If the selection has an anchor (starting point), update the range to end at the caret position
        if (selection.anchorNode) {
            range.setEnd(selection.anchorNode, selection.anchorOffset);
        }

        // Extract the text content before the caret
        const preCaretText = range.toString();

        // Temporarily remove the leading hyphen (if any) to only count digits and decimal points
        const sanitizedText = preCaretText.startsWith('-') ? preCaretText.slice(1) : preCaretText;

        // Count how many digits and decimal points exist before the caret
        digitsBeforeCaret = (sanitizedText.match(/[\d.]/g) || []).length;
    }

    return digitsBeforeCaret;
};

export const setCaretPosition = (element: HTMLElement, digitsCount: number) => {
    const newSelection = window.getSelection();
    const node = element.firstChild; // Get the text node within the element

    if (node && node.textContent) {
        let pos = 0; // Tracks the final position for the caret
        let charsSeen = 0; // Tracks how many valid characters (digits or decimals) have been processed
        const text = node.textContent;

        // Check if the text begins with a hyphen (used for negative numbers)
        const hasLeadingHyphen = text.startsWith('-');

        // Iterate over the text to calculate the caret position based on the number of digits to place it after
        for (let i = 0; i < text.length; i++) {
            // If the first character is a hyphen, skip it but count it towards position tracking
            if (hasLeadingHyphen && i === 0) {
                pos++;
                continue;
            }

            // If the current character is a digit or decimal point, count it
            if (/[\d.]/.test(text[i])) {
                charsSeen++;
            }
            pos++; // Always move position forward

            // Once we've seen the required number of digits, stop
            if (charsSeen >= digitsCount) {
                break;
            }
        }

        // Ensure the position is not out of bounds (greater than the text length)
        pos = Math.min(pos, text.length);

        // Create a new range and set the caret at the calculated position
        const range = document.createRange();
        range.setStart(node, pos);
        range.collapse(true); // Collapse the range so it represents a caret (not a selection)

        // Clear the current selection and apply the new range for the caret
        newSelection?.removeAllRanges();
        newSelection?.addRange(range);
    }
};
