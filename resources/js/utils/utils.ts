// @ts-ignore
import React, {useEffect, useState} from "react";
// @ts-ignore
import { useAuth } from "../context/AuthContext";

export function role(name: string): boolean {
    const {user, setUser} = useAuth();
    if (Array.isArray(user?.role)) {
        const foundRole = user.role.find((roleItem: string) => roleItem === name);
        return !!foundRole; // Devolvemos true si se encuentra el rol, o false si no se encuentra.
    }

    return false;
}
