import { getLocalStorageItem } from "@/utils/LocalStorage";
import { find } from "lodash";

export const HasPermission = (permission) => {
    const user = getLocalStorageItem("user")
    if (user) {
        const userPermissions = user.roleData?.permission ? JSON.parse(user.roleData?.permission) : [];
        const schoolPermissions = user.schoolData?.permission ? JSON.parse(user.schoolData?.permission) : [];

        if (!userPermissions) {
            throw new Error('Role not found');
        }

        return find(userPermissions, per => per === permission) && find(schoolPermissions, per => per === permission);
    }
}

export const HasPermitted = (permission) => {
    const user = getLocalStorageItem("user")
    if (user) {
        const schoolPermissions = user.schoolData?.permission ? JSON.parse(user.schoolData?.permission) : [];

        if (!schoolPermissions) {
            throw new Error('Role not found');
        }

        // return find(userPermissions, per => per === permission) && find(schoolPermissions, per => per === permission);
        return find(schoolPermissions, per => per === permission);
    }
}

