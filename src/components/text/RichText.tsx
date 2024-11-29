import Spinner from 'components/text/Spinner';
import React from 'react';
import { ensureArray } from 'services';
import { defaultTheme } from 'styles/theme';
import { Color, Text } from 'types';
import './RichText.scss';

interface RichTextProps {
    content: Text.RichText;
}

const RichText: React.FC<RichTextProps> = ({ content }) => {
    const richTextSpanArray = ensureArray(content);

    return (
        <div className='rich-text'>
            {richTextSpanArray.map((span, index) => {
                const style = getSpanStyle({ color: span.color });

                return (
                    <span key={index} style={style}>
                        {renderSpinner(span.spinner)}
                        {span.text}
                    </span>
                );
            })}
        </div>
    );
};

interface StyleProps {
    color?: Color.ColorName;
}

const getSpanStyle = (style: StyleProps): React.CSSProperties => {
    const colorPalette = defaultTheme.palette;
    const colorName = style.color ?? 'neutral-900';

    return {
        color: colorPalette[colorName],
    };
};

const renderSpinner = (spinner: Text.Spinner | undefined) => {
    if (!spinner) return null;

    return <Spinner {...spinner} />;
};

RichText.displayName = 'RichText';

export default RichText;
