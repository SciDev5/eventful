import { Color } from "./color"

export interface EventSchedule {
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

export class Timerange {
    readonly end: Date
    constructor(
        readonly start: Date,
        end: Date,
    ) {
        this.end = end.getTime() > start.getTime() ? end : start // ensure length >= 0
    }

    get length_seconds() { return (this.end.getTime() - this.start.getTime()) / 1000 }

    overlaps(other: Timerange): boolean {
        return other.start < this.end && this.start < other.end
    }
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