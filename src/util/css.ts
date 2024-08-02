import { CSSProperties } from "react";

export function css_vars(params: Record<string, any>): CSSProperties {
    return Object.fromEntries(Object.entries(params).map(([k, v]) => (["--" + k, v])))
}