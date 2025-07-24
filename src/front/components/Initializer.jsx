import { useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Initializer = () => {
    const { dispatch } = useGlobalReducer();

    useEffect(() => {
        dispatch({ type: "LOAD_TOKEN" });
    }, []);

    return null; // no renderiza nada, solo ejecuta
};
