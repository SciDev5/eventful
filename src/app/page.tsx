"use client"

import styles from "./page.module.css";
import { useAwait } from "@/util/use";
import { Suspense, useMemo } from "react";
import { EventViewer, EventViewerDataMissing } from "@/components/events/EventViewer";
import { useSearchParams } from "next/navigation";
import { getdata_by_id } from "@/data/fetcher";

export default function Home() {
    return (
        <Suspense fallback={<HomeFallback />}>
            <HomeLoaded />
        </Suspense>
    );
}

function HomeLoaded() {
    const params = useSearchParams()
    const event_id = params.get("event") ?? "rex" // event info source, current major event is rex so default to that
    const is_embed = params.get("is_embed") != null

    const event_schedule = useAwait(
        useMemo(async () => (await getdata_by_id(event_id)) ?? "failed", [event_id])
    )

    return (
        <main className={styles.main + (is_embed ? " " + styles.is_embed : "")}>
            {is_embed ? null : <h2 style={{ padding: "0.6em 1.0em", color: "#aaf9", textWrap: "nowrap" }}>:: EVENTFUL timeline :: [{(event_schedule !== "failed" ? event_schedule : null)?.name}]</h2>}
            <div style={{ position: "absolute", left: 0, right: 0, top: is_embed ? 0 : "3em", bottom: 0 }}>
                {
                    event_schedule != null && event_schedule != "failed"
                        ? <EventViewer schedule={event_schedule} />
                        : <EventViewerDataMissing failed={event_schedule === "failed" ? event_id : false} />
                }
            </div>
        </main >
    );
}
function HomeFallback() {
    return (
        <main className={styles.main}>
            {<h2 style={{ padding: "0.6em 1.0em", color: "#aaf9", textWrap: "nowrap" }}>:: EVENTFUL timeline ::</h2>}
            <div style={{ position: "absolute", left: 0, right: 0, top: "3em", bottom: 0 }}>
                <EventViewerDataMissing failed={false} />
            </div>
        </main >
    );
}
