import { clamp } from "./math";

export class Color {
    constructor(
        readonly r: number,
        readonly g: number,
        readonly b: number,
        readonly a: number = 1,
    ) { }

    static from_hex(hex: string): Color | null {
        if (!/^#[0-9a-f]+$/.test(hex)) return null
        const hex_ = hex.substring(1)
        if (hex_.length === 3 || hex_.length === 4) {
            const [r, g, b, a] = hex_.split("")
                .map(v => parseInt(v, 16) / 15) as [number, number, number, number | undefined]
            return new Color(r, g, b, a)

        } else if (hex_.length === 6 || hex_.length === 8) {
            const [r, g, b, a] = new Array(hex_.length / 2).fill(0)
                .map((_, i) => parseInt(hex_.substring(i * 2, i * 2 + 2), 16) / 255) as [number, number, number, number | undefined]
            return new Color(r, g, b, a)
        } else {
            return null
        }
    }

    to_hex(): string {
        return `#${clamp(Math.floor(this.r * 256), 0, 255)
            }${clamp(Math.floor(this.g * 256), 0, 255)
            }${clamp(Math.floor(this.b * 256), 0, 255)
            }${clamp(Math.floor(this.a * 256), 0, 255)}`
    }
}