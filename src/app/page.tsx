"use client"

import Image from "next/image";
import styles from "./page.module.css";
import { EventTimeline } from "@/components/events/EventTimeline";
import { useAwait } from "@/util/use";
import { useCallback, useMemo, useState } from "react";
import { fetch_trex, trex_to_schedule } from "@/data/schemas/t_rex";
import { EventModal } from "@/components/events/EventModal";

export default function Home() {
  const event_schedule = useAwait(
    useMemo(() => fetch_trex().then(trex_to_schedule), [])
  )
  return (
    <main className={styles.main}>
      <div style={{ width: "95vw", height: "80vh", display: "flex", border: "1px solid" }}>


        {event_schedule &&
          <EventTimeline
            event_schedule={event_schedule}
            color_from_hosts
            rem_per_hr={5}
            timerange={event_schedule.events.map(v => v.time).reduce((a, b) => a.merge(b)).round_outward(60 * 60 * 1000)}
          />}


      </div>
    </main >
  );
}
