"use client"

import styles from "./page.module.css";
import { useAwait } from "@/util/use";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetch_trex, trex_to_schedule } from "@/data/schemas/t_rex";
import { EventViewer, EventViewerLoading } from "@/components/events/EventViewer";

export default function Home() {
    const event_schedule = useAwait(
        useMemo(() => fetch_trex().then(trex_to_schedule), [])
    )

    return (
        <main className={styles.main}>
            <h2 style={{ padding: "0.6em 1.0em", color: "#aaf9", textWrap: "nowrap" }}>:: EVENTFUL timeline :: [{event_schedule?.name}]</h2>
            <div style={{ position: "absolute", left: 0, right: 0, top: "3em", bottom: 0 }}>
                {
                    event_schedule != null
                        ? <EventViewer schedule={event_schedule} />
                        : <EventViewerLoading />
                }
            </div>
        </main >
    );
}
