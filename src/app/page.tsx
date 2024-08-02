"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { EventTimeline } from "@/components/events/EventTimeline";
import { useAwait } from "@/util/use";
import { useCallback, useMemo, useState } from "react";
import { fetch_trex, trex_to_schedule } from "@/data/schemas/t_rex";
import { EventModal } from "@/components/events/EventModal";
import { NameFilter, TaglikeFilter, useComposedFilters } from "@/components/filter/FilterBar";

export default function Home() {
  const event_schedule = useAwait(
    useMemo(() => fetch_trex().then(trex_to_schedule), [])
  )

  const [color_from_hosts, set_color_from_hosts] = useState(true)

  const [event_filter, set_host_filter, set_tag_filter, set_name_filter] = useComposedFilters(3)
  return (
    <main className={styles.main}>
      {event_schedule && <>
        <TaglikeFilter
          options={event_schedule.hosts}
          property="hosts"
          set_filter={set_host_filter}
        />
        <TaglikeFilter
          options={event_schedule.tags}
          property="tags"
          set_filter={set_tag_filter}
        />
        <NameFilter
          schedule={event_schedule}
          set_filter={set_name_filter}
        />
      </>}
      <input type="checkbox" checked={color_from_hosts} onChange={e => set_color_from_hosts(e.currentTarget.checked)} />
      <div style={{ width: "95vw", height: "80vh", display: "flex", border: "1px solid" }}>


        {event_schedule &&
          <EventTimeline
            event_schedule={event_schedule}
            color_from_hosts={color_from_hosts}
            rem_per_hr={5}
            event_filter={event_filter}
            timerange={event_schedule.events.map(v => v.time).reduce((a, b) => a.merge(b)).round_outward(60 * 60 * 1000)}
          />}


      </div>
    </main >
  );
}
