// This needs to go on chain asap
const jannies: string[] = [
    "0x22a973417575E3EA73dD26220aeFe78c16742b33"
]

export function isJanny(hexAddress: string): boolean {
    return jannies.indexOf(hexAddress) != -1
}