import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { privateFetch } from "../fetch/apiFetch";

export const Initializer = () => {
    const { dispatch } = useGlobalReducer();

    useEffect(() => {
        // Paso 1: Cargar token desde localStorage
        const token = localStorage.getItem("token");
        if (!token) return;

        dispatch({ type: "SET_TOKEN", payload: token });

        // Paso 2: Si hay token, cargar datos del usuario autenticado
        privateFetch("/userinfo", "GET").then(data => {
            if (data?.user) {
                dispatch({ type: "SET_USER_INFO", payload: data.user });
            }
        });
    }, []);

    return null;
};
