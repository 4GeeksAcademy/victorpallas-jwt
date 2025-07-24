import { publicFetch, privateFetch } from "./apiFetch";

export const login = async (dispatch, email, password) => {
  let response = await publicFetch("/login", "POST", { email, password });
  if (!response.token) {
    return response;
  }
  localStorage.setItem("token", response.token);
  dispatch({ type: "SET_TOKEN", payload: response.token });
  return response;
};

export const logout = async () => {};

export const register = async () => {};

export const getInfo = async (dispatch) => {
  const response = await privateFetch("/userinfo");

  if (!response || typeof response !== "object") {
    console.error(
      "❌ No se obtuvo una respuesta válida de /userinfo:",
      response
    );
    return null;
  }

  if ("msg" in response) {
    console.warn("⚠️ Mensaje de error del backend:", response.msg);
    return null;
  }

  dispatch({ type: "SET_USER_INFO", payload: response });
  return response;
};
