import { Color } from "../color";
import { EventInfo, EventSchedule, GroupInfo, HostInfo, LocationInfo, TagInfo, Timerange } from "../schedule";

export type TRexAPIResponse = {
    /** The title of the current experience, such as "REX 2023" */
    name: string;
    /** ISO Date string of when the current JSON of events was published */
    published: string;
    events: TRexEvent[];
    dorms: string[];
    tags: string[];
    /** Maps event properties to background colors */
    colors: TRexAPIColors;
    start: string;
    end: string;
};

export type TRexAPIColors = {
    dorms: Record<string, string>;
    tags: Record<string, string>;
};

export type TRexEvent = {
    name: string;
    dorm: string[];
    /** The subcommunity or living group hosting this event, if any */
    group: string | null;
    location: string;
    start: Date;
    end: Date;
    description: string;
    tags: string[];
};

export async function fetch_trex(): Promise<TRexAPIResponse> {
    return (await (await fetch("https://rex.mit.edu/api.json")).json()) as TRexAPIResponse
}

export function trex_to_schedule(trex: TRexAPIResponse): EventSchedule {
    const locations_lookup = new Map<string, number>()
    const locations: LocationInfo[] = []
    const groups_lookup = new Map<string, number>()
    const groups: GroupInfo[] = []
    const hosts_lookup = new Map<string, number>()
    const hosts: HostInfo[] = trex.dorms.map((name, i) => {
        hosts_lookup.set(name, i)
        const color = Color.from_hex(trex.colors.dorms[name])!
        return { name, color }
    })
    const tags_lookup = new Map<string, number>()
    const tags: TagInfo[] = trex.tags.map((name, i) => {
        tags_lookup.set(name, i)
        const color = Color.from_hex(trex.colors.tags[name])!
        return { name, color }
    })

    const events = trex.events.map(({ name, description, start, end, ...v }) => {
        if (!locations_lookup.has(v.location)) {
            const i = locations.length
            locations.push({ name: v.location })
            locations_lookup.set(v.location, i)
        }
        const location = locations_lookup.get(v.location)!
        const hosts = v.dorm.map(dorm => hosts_lookup.get(dorm)!)
        const tags = v.tags.map(tag => tags_lookup.get(tag)!)
        let group = null
        if (v.group != null) {
            if (!groups_lookup.has(v.group)) {
                const i = groups.length
                groups.push({ name: v.group, associated_dorms: new Set() })
                groups_lookup.set(v.group, i)
            }
            group = groups_lookup.get(v.group)!
            for (const host of hosts) {
                groups[group].associated_dorms.add(host)
            }
        }
        return {
            name,
            description,
            time: new Timerange(new Date(start), new Date(end)),
            hosts,
            location,
            tags,
            group,
        } satisfies EventInfo
    })

    return {
        name: trex.name,
        time: new Timerange(new Date(trex.start), new Date(trex.end)),
        events,
        hosts,
        locations,
        groups,
        tags,
    }
}