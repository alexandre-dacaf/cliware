import React from "react";

import { IPrintable } from "../../types/printables";

const Printable = ({ component: Component, props }: IPrintable) => {
    return <Component {...props} />;
};

export default Printable;
