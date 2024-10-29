import { uint } from "@/common/ty_shared";
import { createContext, useContext } from "react";

export interface UserSettings {
    zero_weekday: uint,
}

export const settings_context = createContext<UserSettings>({
    zero_weekday: 0
})

export function useSettings(): UserSettings {
    return useContext(settings_context)
}