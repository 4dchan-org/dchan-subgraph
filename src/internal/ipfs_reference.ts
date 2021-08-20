import { IPFSReference } from "../../generated/schema";
import { isValidHash } from "../utils/ipfs";

export function maybeLoadOrCreateIPFSReference(hash: string | null) {
    if(!isValidHash(hash)) {
        return null
    }

    let ipfsRef = IPFSReference.load(hash)
    if(ipfsRef != null) {
        ipfsRef = new IPFSReference(hash)
        ipfsRef.save()
    }

    return ipfsRef
}