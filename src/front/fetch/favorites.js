import { privateFetch } from "./apiFetch";

export const loadFavorites = async (dispatch) => {
  const res = await privateFetch("/misfavoritos"); // ✅ actualizado
  if (Array.isArray(res)) {
    dispatch({ type: "SET_FAVORITES", payload: res });
  }
};

export const addFavorite = async (dispatch, favorite) => {
  const res = await privateFetch("/misfavoritos", "POST", favorite); // ✅ actualizado
  if (res.id) {
    dispatch({ type: "ADD_FAVORITE", payload: res });
  }
};

export const deleteFavorite = async (dispatch, uid, type) => {
  const res = await privateFetch(`/misfavoritos/${type}/${uid}`, "DELETE"); // ✅ actualizado
  if (res.msg === "Favorito eliminado") {
    dispatch({ type: "REMOVE_FAVORITE", payload: { uid, type } });
  }
};
