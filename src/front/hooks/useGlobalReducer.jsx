import { useContext, useReducer, createContext, useEffect } from "react";
import storeReducer, { initialStore } from "../store";
import { privateFetch } from "../fetch/apiFetch"; // Asegúrate de que esta ruta esté bien

const StoreContext = createContext();

export function StoreProvider({ children }) {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    useEffect(() => {
        // 1. Cargar token
        dispatch({ type: "LOAD_TOKEN" });

        // 2. Luego cargar información del usuario
        const token = localStorage.getItem("token");
        if (!token) return;

        privateFetch("/api/userinfo", "GET")
            .then((data) => {
                if (data?.user) {
                    dispatch({ type: "SET_USER_INFO", payload: data.user });
                }
            })
            .catch((err) => {
                console.warn("Error cargando info de usuario:", err);
            });
    }, []);

    return (
        <StoreContext.Provider value={{ store, dispatch }}>
            {children}
        </StoreContext.Provider>
    );
}

export default function useGlobalReducer() {
    const { dispatch, store } = useContext(StoreContext);
    return { dispatch, store };
}
