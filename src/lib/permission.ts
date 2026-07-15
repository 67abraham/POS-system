import { createAccessControl } from "better-auth/client";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";


export const allPermission = [
    "create",
    "read",
    "update",
    "delete",
    "cancel",
    "view",
    "ban",
    "get",
    "list",
    "set-role"
] as const;

const statement = {
    ...defaultStatements,
    order: ["create", "read", "update", "delete", "cancel"],
    menu: ["create", "read", "update", "delete"],
    table:["create", "read", "update", "delete"],
    menuItem: ["create", "read", "update", "delete"],
    kds: ["read", "update_state"], //kitchen display system
    report: ["read"],
} as const

export const accessControl = createAccessControl(statement)

export const ADMIN = accessControl.newRole({
    order: ["create", "read", "update", "delete", "cancel"],
    menu: ["create", "read", "update", "delete"],
    table:["create", "read", "update", "delete"],
    menuItem: ["create", "read", "update", "delete"],
    kds: ["read", "update_state"], //kitchen display system
    report: ["read"],

    ...adminAc.statements

})

export const CUSTOMER = accessControl.newRole({
    order:["create","read","cancel","update"],
    ...userAc.statements
})

