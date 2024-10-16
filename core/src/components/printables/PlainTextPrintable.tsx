import React from 'react';
import './PlainTextPrintable.css';

interface PlainTextPrintableProps {
  content: string;
}

const PlainTextPrintable = ({ content }: PlainTextPrintableProps) => {
  return <div className="plain-text-printable">{content}</div>;
};

export default PlainTextPrintable;
