import { EventInfo, EventSchedule, HostInfo, TagInfo } from "@/data/schedule"
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react"
import { Chip } from "../chip/Chip"

type EventFilter = (event: EventInfo) => boolean


export function useComposedFilters(n: number): [EventFilter, ...((filter: EventFilter) => void)[]] {
    const filters = useMemo(() => new Array(n).fill(0).map(() => (event: EventInfo) => true as boolean), [n])
    const [update_state, update] = useState(0)

    return [
        useMemo(() => { update_state; return (event: EventInfo) => filters.every(filter => filter(event)) }, [filters, update_state]),
        ...useMemo(() => filters.map((_, i) => (filter: EventFilter) => {
            filters[i] = filter
            update(Math.random)
        }), [filters])
    ]
}

export function TaglikeFilter({ set_filter, property, options }: {
    property: { [k in keyof EventInfo]: EventInfo[k] extends number[] ? k : never }[keyof EventInfo],
    options: HostInfo[] | TagInfo[],
    set_filter: (filter: EventFilter) => void,
}) {
    const [checked, set_checked] = useState(() => options.map(() => false))
    const label_id = useMemo(() => Math.random().toString(36).substring(2), [])

    useEffect(() => {
        const tid = setTimeout(() => {
            if (checked.every(v => v === false)) {
                set_filter(_ => true)
            } else {
                const required_tags = checked.map((v, i) => [v, i] satisfies [any, any]).filter(([v,]) => v).map(([, i]) => i)
                set_filter(event => required_tags.some(tag => event[property].includes(tag)))
            }
        }, 10)
        return () => clearTimeout(tid)
    }, [set_filter, property, options, checked])

    return (<div>
        {
            options.map(({ color, name }, id) => (
                <Chip color={color} key={id}>
                    <>
                        <label htmlFor={label_id + "_" + id}>{name}</label>
                        <input
                            id={label_id + "_" + id}
                            type="checkbox"
                            checked={checked[id]}
                            onChange={e => {
                                const checked_ = [...checked]
                                checked_[id] = e.currentTarget.checked
                                set_checked(checked_)
                            }}
                        />
                    </>
                </Chip>
            ))
        }
    </div>)
}
export function NameFilter({ set_filter, schedule }: {
    set_filter: (filter: EventFilter) => void,
    schedule: EventSchedule,
}) {
    const [name, set_name] = useState("")

    useEffect(() => {
        const tid = setTimeout(() => {
            const name_ = name.trim()
            if (name_ === "") {
                set_filter(_ => true)
            } else {
                const name_norm = name_.toLowerCase().replaceAll(/\s+/g, " ")
                set_filter(event => event.name.toLowerCase().replaceAll(/\s+/g, " ").includes(name_norm) || event.group != null && schedule.groups[event.group].name.toLowerCase().replaceAll(/\s+/g, " ").includes(name_norm))
            }
        }, 10)
        return () => clearTimeout(tid)

    }, [set_filter, name, schedule])

    return (<div>
        <input
            value={name}
            onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => set_name(e.currentTarget.value), [set_name])}
        />
    </div>)
}