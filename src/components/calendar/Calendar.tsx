import { createContext, useContext } from "react"
import styles from "./Calendar.module.css"
import { range_to_arr } from "@/common/util/arr"
import { date_to_day, day_int, day_to_date, day_weekday, MILLISECONDS_PER_DAY, MILLISECONDS_PER_HOUR, month_int, month_length, month_start_weekday } from "@/common/util/datetime"
import { ms_int, uint } from "@/common/ty_shared"
import { useSettings } from "../settings/settings"
import { css_vars } from "@/util/css"

export function TESTCAL() {
    const d = date_to_day(new Date())
    return (
        // <CalendarMonth start={2024 * 12 + 9} />
        <CalendarDays start={d - day_weekday(d)} n={7} />
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
                        <div>
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
                        <CalendarDaysDayContent day_i={day_i} />
                    </div>
                ))}
            </div>
        </div>
    )
}
function CalendarDaysDayContent({
    day_i,
}: {
    day_i: day_int,
}) {
    return (
        <>
            <CalendarDayEvent {...{
                event_data_placeholder: "helloworld",
                channel_i: 0,
                channel_n: 1,
                ms_start: 3 * MILLISECONDS_PER_HOUR,
                ms_end: 4.5 * MILLISECONDS_PER_HOUR,
            }} />

            <CalendarDayEvent {...{
                event_data_placeholder: "abc",
                channel_i: 0,
                channel_n: 2,
                ms_start: 5 * MILLISECONDS_PER_HOUR,
                ms_end: 7 * MILLISECONDS_PER_HOUR,
            }} />
            <CalendarDayEvent {...{
                event_data_placeholder: "def",
                channel_i: 1,
                channel_n: 2,
                ms_start: 6 * MILLISECONDS_PER_HOUR,
                ms_end: 8 * MILLISECONDS_PER_HOUR,
            }} />
        </>
    )
}
function CalendarDayEvent({
    event_data_placeholder,
    channel_n,
    channel_i,
    ms_start,
    ms_end,
}: {
    event_data_placeholder: string,
    channel_n: number,
    channel_i: number,
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
            channel_n,
            channel_i,
            start_hrs: Math.max(ms_start, 0) / MILLISECONDS_PER_HOUR,
            len_hrs: (Math.min(ms_end, MILLISECONDS_PER_DAY) - Math.max(ms_start, 0)) / MILLISECONDS_PER_HOUR,
        })}
    >
        {event_data_placeholder}
    </div>)

}