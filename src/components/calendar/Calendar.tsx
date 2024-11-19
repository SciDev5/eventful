import { createContext, useContext } from "react"
import styles from "./Calendar.module.css"
import { range_to_arr } from "@/common/util/arr"
import { date_to_day, day_int, day_to_date, day_weekday, MILLISECONDS_PER_DAY, MILLISECONDS_PER_HOUR, month_int, month_length, month_start_weekday } from "@/common/util/datetime"
import { ID, ms_int, SchedulerSolidifyInterval, Timerange, uint } from "@/common/ty_shared"
import { useSettings } from "../settings/settings"
import { css_vars } from "@/util/css"
import { Eventslist } from "@/common/event_management"
import { None } from "@/common/util/functional"

export function TESTCAL() {
    const { zero_weekday } = useSettings()
    const d = date_to_day(new Date())
    return (
        // <CalendarMonth start={2024 * 12 + 9} />
        <CalendarDays start={d - day_weekday(d) + zero_weekday} n={7} />
    )
}

function CalendarMonth({
    start,
}: {
    start: month_int,

}) {
    const { zero_weekday } = useSettings()

    const [year, month] = [Math.floor(start / 12), start % 12]
    const start_weekday = (month_start_weekday(year, month) - zero_weekday + 7) % 7
    const n_days = month_length(year, month)
    const n_days_prev = month_length(year, month - 1)
    const n_weeks = Math.ceil((n_days + start_weekday) / 7)

    const i_today = Math.floor((Date.now() - new Date(year, month, 1).getTime()) / 1000 / 60 / 60 / 24)

    return (
        <div className={styles.cal_monthly}>
            <div className={styles.week_header}>
                {range_to_arr(0, 7, i => (
                    <div key={i}>{
                        new Date(year, month, 8 + i - start_weekday)
                            .toLocaleString(undefined, { weekday: "short" })
                    }</div>
                ))}
            </div>
            {range_to_arr(0, n_weeks, week_i => (
                <div key={week_i} className={styles.week}>
                    {range_to_arr(7 * week_i - start_weekday, 7, day_i => (
                        <CalendarMonthDay {...{
                            day_i,
                            n_days,
                            n_days_prev,
                            today: i_today === day_i,
                        }} key={day_i} />
                    ))}
                </div>
            ))}
        </div>
    )
}
function CalendarMonthDay({
    day_i, n_days, n_days_prev, today,
}: {
    day_i: number, n_days: number, n_days_prev: number, today: boolean,
}) {
    const day_fixed = 1 + (
        day_i < 0 ? n_days_prev + day_i :
            day_i >= n_days ? day_i - n_days :
                day_i
    )
    const in_range = day_i >= 0 && day_i < n_days
    return (
        <div
            className={[
                styles.day,
                ...in_range ? [] : [styles.out_of_range],
                ...today ? [styles.today] : []
            ].join(" ")}
        >
            <div>
                {day_fixed}
            </div>
        </div>
    )
}


function CalendarDays({
    start, n,
}: {
    start: day_int,
    n: uint,
}) {
    const today = date_to_day(new Date())
    return (
        <div className={styles.cal_daily}>
            <div className={styles.head}>
                <div className={styles.times} />
                {range_to_arr(start, n, day_i => (
                    <div
                        className={[
                            styles.day,
                            ...today == day_i ? [styles.today] : [],
                        ].join(" ")}
                        key={day_i}
                    >
                        <div>{day_to_date(day_i).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</div>
                    </div>
                ))}
            </div>
            <div className={styles.body}>
                <div className={styles.times}>
                    {range_to_arr(0, 24, hr => (
                        <div
                            key={hr}
                        >
                            {new Date(0, 0, 0, hr, 0).toLocaleTimeString(undefined, { hour: "numeric" })}
                            {/* {new Date(0, 0, 0, hr, 0).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hour12: false })} */}
                        </div>
                    ))}
                </div>
                {range_to_arr(start, n, day_i => (
                    <div
                        className={[
                            styles.day,
                            ...today == day_i ? [styles.today] : [],
                        ].join(" ")}
                        key={day_i}
                    >
                        <CalendarDaysDayContent day_i={day_i} events={new Eventslist([
                            {
                                id: new ID(0),
                                name: "the",
                                default_timezone: -5,
                                description: ":3",
                                host: [],
                                location: 0,
                                schedule_next: [],
                                schedule_solidify: { interval: SchedulerSolidifyInterval.Daily, n_lead: 0 },
                                times: [
                                    {
                                        id: new ID(0),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 1), new Date(Date.now() + 1000 * 60 * 60 * 1)),
                                    },
                                    {
                                        id: new ID(1),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() + MILLISECONDS_PER_DAY), new Date(Date.now() + 1000 * 60 * 60 * 2 + 2 * MILLISECONDS_PER_DAY)),
                                    },
                                    {
                                        id: new ID(2),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - MILLISECONDS_PER_DAY - 1000 * 60 * 60 * 5), new Date(Date.now() + 1000 * 60 * 60 * 2 + 2 * MILLISECONDS_PER_DAY)),
                                    },
                                    {
                                        id: new ID(3),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 5), new Date(Date.now() - 1000 * 60 * 60 * 3)),
                                    },
                                    {
                                        id: new ID(4),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 4), new Date(Date.now() - 1000 * 60 * 60 * 2)),
                                    },
                                    {
                                        id: new ID(5),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 6), new Date(Date.now() - 1000 * 60 * 60 * 4)),
                                    },
                                    {
                                        id: new ID(6),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 8), new Date(Date.now() - 1000 * 60 * 60 * 7)),
                                    },
                                    {
                                        id: new ID(7),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 8), new Date(Date.now() - 1000 * 60 * 60 * 7)),
                                    },
                                    {
                                        id: new ID(8),
                                        cancelled: false,
                                        host: None,
                                        location: None,
                                        time: new Timerange(new Date(Date.now() - 1000 * 60 * 60 * 8), new Date(Date.now() - 1000 * 60 * 60 * 7)),
                                    },
                                ]
                            }
                        ])} />
                    </div>
                ))}
            </div>
        </div>
    )
}
function CalendarDaysDayContent({
    day_i,
    events,
}: {
    day_i: day_int,
    events: Eventslist,
}) {
    const ms_day_start = day_to_date(day_i).getTime()
    const day_events = events.starts_or_ends_during_day(day_i)
    console.log(day_i, day_events, events);

    const assembled = assemble_tracks(ms_day_start, day_events.map(event => ({ time: event.time, event: event })))

    return (
        <>
            {assembled.map(({ track_i, track_n, ms_start, ms_end, event }, i) => (
                <CalendarDayEvent
                    {...{ ms_start, ms_end, track_i, track_n }}
                    event_data_placeholder={event.id.id + "#"}
                    key={i}
                />
            ))}
        </>
    )
}
function CalendarDayEvent({
    event_data_placeholder,
    track_n,
    track_i,
    ms_start,
    ms_end,
}: {
    event_data_placeholder: string,
    track_n: uint,
    track_i: uint,
    ms_start: ms_int,
    ms_end: ms_int,
}) {
    if (ms_end < ms_start) { return (<>!!!err!!!</>) }

    return (<div
        className={
            styles.event
            + (ms_start < 0 ? " " + styles.cut_start : "")
            + (ms_end > MILLISECONDS_PER_DAY ? " " + styles.cut_end : "")
        }
        style={css_vars({
            track_n,
            track_i,
            start_hrs: Math.max(ms_start, 0) / MILLISECONDS_PER_HOUR,
            len_hrs: (Math.min(ms_end, MILLISECONDS_PER_DAY) - Math.max(ms_start, 0)) / MILLISECONDS_PER_HOUR,
        })}
    >
        {event_data_placeholder}
    </div>)

}

function assemble_tracks<T>(
    ms_day_start: uint,
    events: {
        time: Timerange,
        event: T,
    }[],
): {
    track_n: uint,
    track_i: uint,
    ms_start: ms_int,
    ms_end: ms_int,
    event: T,
}[] {
    const tracks: ({ time: Timerange, event: T }[])[] = []
    const events_ordered: ({ track_i: uint, event: { time: Timerange, event: T } })[] = []
    for (const event of events.toSorted((a, b) => a.time.end.getTime() - b.time.end.getTime())) {
        let track_i = tracks.findIndex(track => !track[track.length - 1].time.overlaps(event.time))
        if (track_i === -1) track_i = (() => {
            const new_track: { time: Timerange, event: T }[] = []
            tracks.push(new_track)
            return tracks.length - 1
        })()

        tracks[track_i].push(event)
        events_ordered.push({ track_i, event })
    }

    if (events_ordered.length === 0) {
        return []
    }


    const events_out = []
    let streak_bounds: Timerange = events_ordered[0].event.time
    let max_track_i = events_ordered[0].track_i
    const events_streak = [{ track_i: 0, ...events_ordered[0].event }]
    for (const { track_i, event: { time, event } } of events_ordered.slice(1)) {
        if (streak_bounds.overlaps(time)) {
            events_streak.push({ track_i, time, event })
            if (track_i > max_track_i) {
                max_track_i = track_i
            }
            streak_bounds = streak_bounds.merge(time)
        } else {
            events_out.push(...events_streak.map(({
                event,
                time,
                track_i,
            }) => ({
                ms_start: time.start_ms - ms_day_start,
                ms_end: time.end_ms - ms_day_start,
                track_i,
                track_n: max_track_i + 1,
                event,
            })))
            events_streak.length = 0
            events_streak.push({ track_i, time, event })
            max_track_i = track_i
            streak_bounds = time
        }
    }
    events_out.push(...events_streak.map(({
        event,
        time,
        track_i,
    }) => ({
        ms_start: time.start_ms - ms_day_start,
        ms_end: time.end_ms - ms_day_start,
        track_i,
        track_n: max_track_i + 1,
        event,
    })))
    return events_out
}