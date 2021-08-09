import { BigInt, JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"


export function ensureObject(jsonValue: JSONValue | null): TypedMap<string, JSONValue> | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.OBJECT) {
        return jsonValue.toObject()
    }
    
    return null
}

export function ensureString(jsonValue: JSONValue | null): string | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.STRING) {
        return jsonValue.toString()
    }
    
    return null
}

export function ensureNumber(jsonValue: JSONValue | null): BigInt | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.NUMBER) {
        return jsonValue.toBigInt()
    }
    
    return null
}

export function ensureArray(jsonValue: JSONValue | null): JSONValue[] | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.ARRAY) {
        return jsonValue.toArray()
    }
    
    return null
}

// ERROR AS204: Basic type 'boolean' cannot be nullable.
// export function ensureBoolean(jsonValue: JSONValue | null): boolean | null {
export function ensureBoolean(jsonValue: JSONValue | null): string | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.BOOL) {
        return jsonValue.toBool() ? "true" : "false"
    }
    
    return null
}

export function ensureIpfs(jsonValue: JSONValue | null): string | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.STRING) {
        const maybeHash = jsonValue.toString()
        if(0 == maybeHash.indexOf("Qm") && maybeHash.length === 48) {
            return maybeHash
        }
    }
    
    return null
}