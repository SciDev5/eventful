import { Timerange } from "@/common/ty_shared"
import { Color } from "../common/util/color"

export interface EventSchedule {
    readonly id: string,
    readonly time: Timerange,
    readonly name: string,
    readonly tags: TagInfo[],
    readonly hosts: HostInfo[],
    readonly groups: GroupInfo[],
    readonly locations: LocationInfo[],
    readonly events: EventInfo[],
}

export interface TagInfo {
    name: string,
    color: Color,
}
export interface HostInfo {
    name: string,
    color: Color,
}
export interface GroupInfo {
    name: string,
    associated_dorms: Set<number>
}
export interface LocationInfo {
    name: string,
}

export interface EventInfo {
    readonly time: Timerange,
    readonly name: string,
    readonly description: string | null,
    readonly tags: number[],
    readonly hosts: number[],
    readonly group: number | null,
    readonly location: number,
}