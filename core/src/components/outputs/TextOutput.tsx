// src/components/outputs/TextOutput.tsx

import React from 'react';
import './TextOutput.css'; // Arquivo CSS para estilos

interface TextOutputProps {
  content: string;
}

const TextOutput: React.FC<TextOutputProps> = ({ content }) => {
  return <div className="text-output">{content}</div>;
};

export default TextOutput;
