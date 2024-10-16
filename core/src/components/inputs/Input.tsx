// src/components/inputs/Input.tsx

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import './Input.css'; // Arquivo CSS para estilos

// Interface para os métodos que serão expostos via ref
export interface InputHandle {
  handleFocus: () => void;
  clear: () => void;
}

// Interface para as propriedades recebidas pelo Input
interface InputProps {
  onEnterPressed: (content: string) => void;
  onBlurred: () => void;
}

// Definição do componente Input usando forwardRef corretamente
const Input = forwardRef<InputHandle, InputProps>(
  ({ onEnterPressed, onBlurred }, ref) => {
    const inputElementRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState<string>('');

    // Expor métodos via ref
    useImperativeHandle(ref, () => ({
      handleFocus: () => {
        inputElementRef.current?.focus();
      },
      clear: () => {
        setValue('');
      },
    }));

    // Função para lidar com a mudança de valor no input
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    // Função para lidar com a tecla pressionada
    const handleKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (value.trim() !== '') {
          onEnterPressed(value.trim());
        }
      }
    };

    // Função para lidar com o desfoque
    const handleBlur = () => {
      onBlurred();
    };

    return (
      <input
        type="text"
        ref={inputElementRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="input-field"
        placeholder="Digite um comando..."
      />
    );
  }
);

// Definir displayName para melhor depuração (opcional, mas recomendado)
Input.displayName = 'Input';

export default Input;
