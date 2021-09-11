import { Admin, User } from "../../generated/schema";

export function isAdmin(user: User): boolean {
    return Admin.load(user.address) != null
}