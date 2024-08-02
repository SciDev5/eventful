import { EventInfo, EventSchedule, HostInfo, TagInfo } from "@/data/schedule"
import { ChangeEvent, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { Chip } from "../chip/Chip"
import styles from "./FilterBar.module.css"
import { css_vars } from "@/util/css"

type EventFilter = (event: EventInfo) => boolean

export function FilterBar({ children }: { children: JSX.Element | JSX.Element[] }) {
    return (<div className={styles.filter_bar}>
        {children}
    </div>)
}

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

    const label_id = useId()

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


    const [focused_outer, set_focused_outer] = useState(false)

    return (
        <div
            className={styles.filter_taglike + (focused_outer ? " " + styles.focused_outer : "")}
            tabIndex={1}
            onKeyDown={() => {
                console.log("focus!");
                set_focused_outer(true)
            }}
            onBlur={() => set_focused_outer(false)}
        >
            <div
                className={styles.filter_taglike_preview}
            >
                {
                    checked.every(v => v === false)
                        ? (<>
                            {<div className={styles.placeholder}>filter by {property}</div>}
                        </>) : (<>
                            {<div className={styles.label}>{property}</div>}
                            <div className={styles.scroller}>
                                {
                                    checked.map((v, i) => v ? [options[i], i] satisfies [any, any] : null).filter(v => v != null).map(([{ name, color }, id]) => (
                                        <Chip color={color} key={id}>
                                            {name}
                                        </Chip>
                                    ))
                                }
                            </div>
                        </>)
                }
            </div>
            <dialog
                className={styles.filter_taglike_body}
                open
                tabIndex={-1}
            >
                {
                    options.map(({ color, name }, id) => (
                        <label
                            style={css_vars({
                                text_color: color.contrasting_text_color().to_hex(),
                                color: color.to_hex(0.75),
                            })}
                            className={styles.filter_taglike_entry}
                            htmlFor={label_id + "_" + id}
                            key={id}
                        >
                            {name}
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
                        </label>
                    ))
                }
            </dialog>
        </div>
    )
}



export function NameFilter({ set_filter, schedule }: {
    set_filter: (filter: EventFilter) => void,
    schedule: EventSchedule,
}) {
    const [name, set_name] = useState("")
    const id = useId()

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

    return (<label className={styles.filter_searchbar} htmlFor={id}>
        <span>
            search
        </span>
        <input
            value={name}
            id={id}
            onChange={useCallback((e: ChangeEvent<HTMLInputElement>) => set_name(e.currentTarget.value), [set_name])}
        />
    </label>)
}

export function Toggle({ label, value, on_change }: { label: string, value: boolean, on_change: (value: boolean) => void }) {
    const id = useId()

    return (
        <label
            className={styles.ext_toggle}
            htmlFor={id}
        >
            <span>
                {label}
            </span>
            <input
                id={id}
                type="checkbox"
                checked={value}
                onChange={e => on_change(e.currentTarget.checked)}
            />
        </label>
    )
}