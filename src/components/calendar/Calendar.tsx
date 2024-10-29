import { createContext, useContext } from "react"
import styles from "./Calendar.module.css"
import { range_to_arr as map_range } from "@/util/arr"
import { date_to_day, day_int, day_to_date, day_weekday, month_int, month_length, month_start_weekday } from "@/util/datetime"
import { uint } from "@/common/ty_shared"
import { useSettings } from "../settings/settings"

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
                {map_range(0, 7, i => (
                    <div key={i}>{
                        new Date(year, month, 8 + i - start_weekday)
                            .toLocaleString(undefined, { weekday: "short" })
                    }</div>
                ))}
            </div>
            {map_range(0, n_weeks, week_i => (
                <div key={week_i} className={styles.week}>
                    {map_range(7 * week_i - start_weekday, 7, day_i => (
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
            {map_range(start, n, day_i => (
                <div
                    className={[
                        styles.day,
                        ...today == day_i ? [styles.today] : [],
                    ].join(" ")}
                    key={day_i}
                >
                    <div>{day_to_date(day_i).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</div>
                    <CalendarDaysDayContent day_i={day_i} />
                </div>
            ))}
        </div>
    )
}
function CalendarDaysDayContent({
    day_i,
}: {
    day_i: day_int,
}) {
    return (
        <div>
            ...content...
        </div>
    )
}