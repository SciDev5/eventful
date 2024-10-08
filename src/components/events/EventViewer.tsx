import { EventSchedule } from "@/data/schedule";
import { FilterBar, Toggle, NameFilter, TaglikeFilter, useComposedFilters } from "../filter/FilterBar";
import { EventTimeline, FavoriteId } from "./EventTimeline";
import styles from "./EventViewer.module.css"
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { css_vars } from "@/util/css";
import { clamp } from "@/util/math";


const FAVORITES_LOCALHOST_ID = "fav_"
export function save_favorites(event_id: string, favorites: FavoriteId[]) {
    const id = FAVORITES_LOCALHOST_ID + event_id
    localStorage.setItem(id, JSON.stringify(favorites))
}
export function load_favorites(event_id: string,): FavoriteId[] {
    const id = FAVORITES_LOCALHOST_ID + event_id
    return JSON.parse(localStorage.getItem(id) ?? "null") as FavoriteId[] ?? []
}

export function EventViewerDataMissing({ failed }: { failed: string | false }) {
    return (
        <div className={styles.root_container}>
            <div style={{ flex: "1 0" }} />
            <div style={{ flex: "0 0", fontSize: "min(20vh, 10vw)", color: "#1137", textAlign: "center" }}>
                {failed !== false
                    ? `Failed to locate event schedule '${failed}'.`
                    : "loading..."}
            </div>
            <div style={{ flex: "1 0" }} />
        </div>
    )
}

export function EventViewer({ schedule }: { schedule: EventSchedule }) {
    const [color_from_hosts, set_color_from_hosts] = useState(true)
    const [show_only_favorites, set_show_only_favorites] = useState(false)
    const [event_filter, set_host_filter, set_tag_filter, set_name_filter, set_favorites_filter] = useComposedFilters(4)
    const [favorites, _set_favorites] = useState<FavoriteId[]>([])
    useEffect(() => {
        _set_favorites(load_favorites(schedule.id))
    }, [schedule])

    const [em_per_hr, set_em_per_hr] = useState(8)
    const container_ref = useRef<HTMLDivElement>(null)
    const time_scroll_ref = useRef<HTMLDivElement>(null)
    const set_em_per_hr_safe = (new_em_per_hr: number) => {
        const time_scroll = time_scroll_ref.current!
        const container = container_ref.current!
        // const scroll_amt = (time_scroll.scrollLeft + time_scroll.clientWidth / 2) / (time_scroll.scrollWidth + time_scroll.clientWidth)
        const scroll_amt = (time_scroll.scrollLeft + container.clientWidth / 2) / time_scroll.scrollWidth
        set_em_per_hr(new_em_per_hr)
        setTimeout(() => {
            time_scroll.scrollLeft = scroll_amt * time_scroll.scrollWidth - container.clientWidth / 2
            // time_scroll.scrollLeft = clamp(scroll_amt * (time_scroll.scrollWidth + time_scroll.clientWidth) - time_scroll.clientWidth / 2, 0, time_scroll.scrollWidth)
        }, 0);
    }

    return (
        <div className={styles.root_container} ref={container_ref} >
            <FilterBar>
                <NameFilter
                    schedule={schedule}
                    set_filter={set_name_filter}
                />
                <TaglikeFilter
                    options={schedule.hosts}
                    property="hosts"
                    set_filter={set_host_filter}
                />
                <TaglikeFilter
                    options={schedule.tags}
                    property="tags"
                    set_filter={set_tag_filter}
                />
                <Toggle
                    label={color_from_hosts ? "color: HOST" : "color: TAGS"}
                    value={color_from_hosts}
                    on_change={v => set_color_from_hosts(v)}
                />
                <Toggle
                    label={show_only_favorites ? "Show All" : "Show Favorites"}
                    value={show_only_favorites}
                    on_change={v => {
                        set_show_only_favorites(v)
                        set_favorites_filter(v ? (
                            x => favorites.includes(x.name)
                        ) : (
                            () => true
                        ))
                    }}
                />
            </FilterBar>
            <div className={styles.timeline_container} style={css_vars({ em_per_hr })} >
                <EventTimeline
                    event_schedule={schedule}
                    color_from_hosts={color_from_hosts}
                    em_per_hr="inherit"
                    event_filter={event_filter}
                    timerange={useMemo(() => schedule.events.map(v => v.time).reduce((a, b) => a.merge(b)).round_outward(60 * 60 * 1000), [schedule])}
                    time_scroll_ref={time_scroll_ref}
                    favorites={favorites}
                />
            </div>
            <div className={styles.zoom} >
                <button onClick={() => set_em_per_hr_safe(em_per_hr * 2)}>{"+"}</button>
                <button onClick={() => set_em_per_hr_safe(em_per_hr / 2)}>{"-"}</button>
            </div>
            <div className={styles.info} >
                {schedule.name}
                <br />
                {schedule.time.start.toLocaleDateString("zh", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll(/\//g, "-")}
                {" -> "}
                {new Date(schedule.time.end.getTime() - 1).toLocaleDateString("zh", { year: "numeric", month: "2-digit", day: "2-digit" }).replaceAll(/\//g, "-")}
            </div>
        </div>
    );
}