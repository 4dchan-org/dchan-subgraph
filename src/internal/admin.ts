import { Admin } from "../../generated/schema"
import { UserId } from "./user"

export function isAdmin(userId: UserId): boolean {
    return Admin.load(userId) != null
}