import { useEffect, useMemo, useState } from "react";

export function useAwait<T>(promise: Promise<T>, handle_err?: (err: any) => void): T | null {
    const [value, set_value] = useState<T | null>(null)
    useEffect(() => {
        let res_destroy = () => { }
        const destroy = new Promise<void>((res) => { res_destroy = res })

        Promise.any([promise.then(v => ({ v })), destroy]).then(res => {
            if (res == null) return
            set_value(res.v)
        }).catch(err => {
            handle_err?.(err)
        })

        return res_destroy
    }, [promise, handle_err, set_value])
    return value
}