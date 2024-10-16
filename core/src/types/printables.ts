import React from "react";

export interface IPrintable {
    component: React.ComponentType<any>;
    props: Record<string, any>;
}
