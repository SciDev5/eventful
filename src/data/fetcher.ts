import { EventSchedule } from "./schedule";
import { fetch_trex, trex_to_schedule } from "./schemas/t_rex";

async function getdata_trex() {
    return fetch_trex().then(trex_to_schedule)
}


export async function getdata_by_id(id: string): Promise<EventSchedule | null> {
    switch (id) {
        case "rex": return fetch_trex().then(trex_to_schedule)
        default: return null
    }
}