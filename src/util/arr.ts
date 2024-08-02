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