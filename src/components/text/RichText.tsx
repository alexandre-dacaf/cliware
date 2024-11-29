import Spinner from 'components/text/Spinner';
import React from 'react';
import { ensureArray } from 'services';
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
    const colors = {
        blue: '#77bcfb',
        'blue-dark': '#5c8bc4',
        'blue-light': '#a0d4f7',
        cyan: '#00bcd4',
        'cyan-dark': '#0097a7',
        'cyan-light': '#66c2cc',
        teal: '#4db6ac',
        'teal-dark': '#00796b',
        'teal-light': '#80cbc4',
        green: '#7ce38b',
        'green-dark': '#4d8f5f',
        'green-light': '#a0f3c1',
        yellow: '#faa356',
        'yellow-dark': '#f57f24',
        'yellow-light': '#fbd59b',
        orange: '#ff8c42',
        'orange-dark': '#e67e22',
        'orange-light': '#ffbe80',
        red: '#fa7970',
        'red-dark': '#f0625b',
        'red-light': '#fbb1a4',
        pink: '#f06292',
        'pink-dark': '#d81b60',
        'pink-light': '#f8bbd0',
        purple: '#cea5fb',
        'purple-dark': '#9a6ed2',
        'purple-light': '#e2b8ff',
        'neutral-100': '#1c2128',
        'neutral-200': '#22272e',
        'neutral-300': '#2f353d',
        'neutral-400': '#444c56',
        'neutral-500': '#5a626b',
        'neutral-600': '#6d777f',
        'neutral-700': '#768390',
        'neutral-800': '#89929b',
        'neutral-900': '#b0b7bd',
        'neutral-light': '#c9c9c9',
    };

    const colorName = style.color ?? 'neutral-900';

    return {
        color: colors[colorName],
    };
};

const renderSpinner = (spinner: Text.Spinner | undefined) => {
    if (!spinner) return null;

    return <Spinner {...spinner} />;
};

RichText.displayName = 'RichText';

export default RichText;
