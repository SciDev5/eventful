import { useEffect, useRef, useCallback, MouseEvent, RefObject, useState } from "react";
import styles from "./EventModal.module.css"
import { EventInfo, EventSchedule } from "@/data/schedule";
import { css_vars } from "@/util/css";
import { Chip } from "../chip/Chip";
import { Color } from "@/util/color";
import { FavoriteId } from "./EventTimeline";
import { save_favorites } from "./EventViewer";

export function EventModalShower({ control_ref, schedule, favorites }: { control_ref: { set_modal: (e: EventInfo) => void }, schedule: EventSchedule, favorites: FavoriteId[] }) {
    const [show_modal, set_show_modal] = useState<EventInfo | null>(null)
    const dismiss_modal = useCallback(() => {
        console.log("DISMISSING");

        set_show_modal(null)
    }, [set_show_modal])

    control_ref.set_modal = set_show_modal

    return (<>
        {show_modal && <EventModal event={show_modal} schedule={schedule} dismiss={dismiss_modal} favorites={favorites} />}
    </>)
}

export function EventModal({ event, schedule, dismiss, favorites }: { event: EventInfo, schedule: EventSchedule, dismiss: () => void, favorites: FavoriteId[] }) {
    const ref = useRef<HTMLDialogElement>(null)

    const [, _set_updator] = useState(0)
    const force_update = useCallback(() => _set_updator(Math.random()), [])

    useEffect(() => {
        ref.current!.showModal()
    }, [])

    const dismiss_on_click = useCallback((e: MouseEvent) => { if (e.target === e.currentTarget) dismiss() }, [dismiss])

    const color = (event.hosts[0] != null ? schedule.hosts[event.hosts[0]].color : Color.from_hex("#77f")!)

    return (
        <>
            <dialog
                ref={ref}
                className={styles.event_modal}
                onClick={dismiss_on_click}
                onClose={dismiss}
                tabIndex={-1}
            >
                <div style={css_vars({ color: color.to_hex(0.2), color_light: color.to_hex(.1) })}>
                    <button onClick={() => {
                        const id = event.name
                        const i_id = favorites.indexOf(id)
                        if (i_id != -1) {
                            favorites.splice(i_id, 1)
                        } else {
                            favorites.push(id)
                        }
                        save_favorites(schedule.id, favorites)
                        force_update()
                    }} className={`${styles.favorite} ${favorites.includes(event.name) ? styles.favorited : styles.unfavorited}`}></button>
                    <div className={styles.event_time}>
                        <span>{event.time.start.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className={styles.line} />
                        <span>{event.time.end.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>

                    <div className={styles.event_name}>
                        {event.name}
                    </div>

                    <div className={styles.event_description + " " + styles.hide_no_hov}>
                        {event.description}
                    </div>


                    <div className={styles.event_host}>{event.hosts.map(host_id => (<span style={css_vars({ host_color: schedule.hosts[host_id].color.to_hex() })} key={host_id}>{schedule.hosts[host_id].name}</span>))}</div>

                    {event.group != null && <div className={styles.event_group}>{schedule.groups[event.group].name}</div>}

                    <div className={styles.event_location}>{schedule.locations[event.location].name}</div>

                    <div className={styles.event_tags}>
                        {event.tags.map(tag_id => (<Chip color={schedule.tags[tag_id].color} key={tag_id}>{schedule.tags[tag_id].name}</Chip>))}
                    </div>
                </div>

            </dialog>
        </>
    )
}