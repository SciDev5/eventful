import { Color } from "../util/color"

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

export class Timerange {
    readonly end: Date
    constructor(
        readonly start: Date,
        end: Date,
    ) {
        this.end = end.getTime() > start.getTime() ? end : start // ensure length >= 0
    }

    get length_ms() { return (this.end.getTime() - this.start.getTime()) }
    get length_seconds() { return (this.end.getTime() - this.start.getTime()) / 1000 }
    get length_hours() { return (this.end.getTime() - this.start.getTime()) / 1000 / 60 / 60 }

    overlaps(other: Timerange): boolean {
        return other.start < this.end && this.start < other.end
    }
    contains(time: Date): boolean {
        return time < this.end && time >= this.start
    }
    merge(other: Timerange): Timerange {
        return new Timerange(
            this.start < other.start ? this.start : other.start,
            this.end > other.end ? this.end : other.end,
        )
    }
    round_outward(interval_ms: number, base: Date = new Date("2024-01-01 00:00")): Timerange {
        const base_ms = base.getTime()
        return new Timerange(
            new Date(Math.floor((this.start.getTime() - base_ms) / interval_ms) * interval_ms + base_ms),
            new Date(Math.ceil((this.end.getTime() - base_ms) / interval_ms) * interval_ms + base_ms),
        )
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