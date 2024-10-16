// src/components/outputs/Printable.tsx

import React from 'react';

interface PrintableProps {
  component: React.ComponentType<any>;
  props: Record<string, any>;
}

const Printable: React.FC<PrintableProps> = ({ component: Component, props }) => {
  return <Component {...props} />;
};

export default Printable;
