export function swap<T>(arr: T[], i: number, j: number) {
    const tmp = arr[i]
    arr[i] = arr[j]
    arr[j] = tmp
}
export function shuffle<T>(arr: T[]) {
    for (let i = 0; i < arr.length; i++) {
        swap(arr, i, Math.floor(Math.random() * arr.length))
    }
}
export function range_to_arr<T>(i0: number, n: number, map: (i: number) => T): T[] {
    return new Array(n).fill(0).map((_, i) => map(i + i0))
}