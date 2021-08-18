export function isValidHash(hash: string | null) {
    return hash == null || 0 == hash.indexOf("Qm") && hash.length === 48
}