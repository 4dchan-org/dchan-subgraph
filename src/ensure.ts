import { BigInt, JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"


export function ensureObject(jsonValue: JSONValue | null): TypedMap<string, JSONValue> | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.OBJECT) {
        return jsonValue.toObject()
    } else {
        return null
    }
}

export function ensureString(jsonValue: JSONValue | null): string | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.STRING) {
        return jsonValue.toString()
    } else {
        return null
    }
}

export function ensureNumber(jsonValue: JSONValue | null): BigInt | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.NUMBER) {
        return jsonValue.toBigInt()
    } else {
        return null
    }
}

export function ensureArray(jsonValue: JSONValue | null): JSONValue[] | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.ARRAY) {
        return jsonValue.toArray()
    } else {
        return null
    }
}

export function ensureBoolean(jsonValue: JSONValue | null): boolean | null {
    if (jsonValue != null && jsonValue.kind == JSONValueKind.BOOL) {
        return jsonValue.toBool()
    } else {
        return null
    }
}