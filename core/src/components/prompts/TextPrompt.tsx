// src/components/prompts/TextPrompt.tsx

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import Input, { InputHandle } from '../inputs/Input';
import Printable from '../outputs/Printable';
import TextOutput from '../outputs/TextOutput';
import './TextPrompt.css'; // Arquivo CSS para estilos

// Interface para os métodos que serão expostos via ref
export interface TextPromptHandle {
  handleFocus: () => void;
}

// Interface para as propriedades recebidas pelo TextPrompt
interface TextPromptProps {
  onPrint: (component: React.ComponentType<any>, props: Record<string, any>) => void;
  onBlurred: () => void;
}

// Definição do componente TextPrompt usando forwardRef corretamente
const TextPrompt = forwardRef<TextPromptHandle, TextPromptProps>(
  ({ onPrint, onBlurred }, ref) => {
    const inputRef = useRef<InputHandle>(null);

    // Expor método handleFocus via ref
    useImperativeHandle(ref, () => ({
      handleFocus: () => {
        inputRef.current?.handleFocus();
      },
    }));

    // Função para lidar com o evento de Enter pressionado no Input
    const handleEnterPressed = (content: string) => {
      onPrint(TextOutput, { content });
      inputRef.current?.clear();
    };

    // Função para lidar com o evento de desfoque no Input
    const handleBlurred = () => {
      onBlurred();
    };

    return (
      <div className="terminal__prompt">
        <Input
          ref={inputRef}
          onEnterPressed={handleEnterPressed}
          onBlurred={handleBlurred}
        />
      </div>
    );
  }
);

// Definir displayName para melhor depuração (opcional, mas recomendado)
TextPrompt.displayName = 'TextPrompt';

export default TextPrompt;
