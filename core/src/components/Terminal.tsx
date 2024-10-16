// src/components/Terminal.tsx

import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useEffect,
} from 'react';
import TextPrompt, { TextPromptHandle } from './prompts/TextPrompt';
import Printable from './outputs/Printable';
import './Terminal.css'; // Arquivo CSS para estilos

// Interface para os métodos que serão expostos via ref
export interface TerminalHandle {
  activate: () => void;
  deactivate: () => void;
  hover: () => void;
  unhover: () => void;
}

// Interface para as propriedades recebidas pelo Terminal
interface TerminalProps {
  terminalIndex: number;
  onBlurred: (index: number) => void;
}

// Interface para os itens do histórico do terminal
interface TerminalHistoryItem {
  component: React.ComponentType<any>;
  props: Record<string, any>;
}

// Definição do componente Terminal usando forwardRef corretamente
const Terminal = forwardRef<TerminalHandle, TerminalProps>(
  ({ terminalIndex, onBlurred }, ref) => {
    const [terminalHistory, setTerminalHistory] = useState<TerminalHistoryItem[]>([]);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const selfRef = useRef<HTMLDivElement>(null);
    const textPromptRef = useRef<TextPromptHandle>(null);

    // Expor métodos via ref
    useImperativeHandle(ref, () => ({
      activate: () => {
        setIsActive(true);
        textPromptRef.current?.handleFocus();
      },
      deactivate: () => {
        setIsActive(false);
      },
      hover: () => {
        setIsHovered(true);
      },
      unhover: () => {
        setIsHovered(false);
      },
    }));

    // Scroll para o fundo sempre que terminalHistory for atualizado
    useEffect(() => {
      scrollToBottom();
    }, [terminalHistory]);

    const scrollToBottom = () => {
      if (selfRef.current) {
        selfRef.current.scrollTop = selfRef.current.scrollHeight;
      }
    };

    // Função para lidar com o evento de impressão do TextPrompt
    const handlePrint = (component: React.ComponentType<any>, props: Record<string, any>) => {
      setTerminalHistory((prev) => [...prev, { component, props }]);
    };

    // Função para lidar com o evento de desfoque
    const handleBlurred = () => {
      onBlurred(terminalIndex);
    };

    return (
      <div
        className={`terminal ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
        ref={selfRef}
        tabIndex={-1}
      >
        {terminalHistory.map((item, index) => (
          <Printable key={index} component={item.component} props={item.props} />
        ))}

        <TextPrompt
          ref={textPromptRef}
          onPrint={handlePrint}
          onBlurred={handleBlurred}
        />
      </div>
    );
  }
);

// Definir displayName para melhor depuração (opcional, mas recomendado)
Terminal.displayName = 'Terminal';

export default Terminal;
