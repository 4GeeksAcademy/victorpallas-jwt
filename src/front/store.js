export const initialStore = () => {
  return {
    message: null,
    token: null,
    userInfo: {},
    favorites: [], // ✅ NUEVO: lista de favoritos
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task":
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };

    case "SET_TOKEN":
      return {
        ...store,
        token: action.payload,
      };

    case "LOAD_TOKEN":
      return {
        ...store,
        token: localStorage.getItem("token") || null,
      };

    case "SET_USER_INFO":
      return {
        ...store,
        userInfo: action.payload,
      };

    // ✅ NUEVO: agregar favorito
    case "ADD_FAVORITE":
      if (
        store.favorites.some(
          (fav) =>
            fav.uid === action.payload.uid && fav.type === action.payload.type
        )
      ) {
        return store; // ya está en favoritos
      }
      return {
        ...store,
        favorites: [...store.favorites, action.payload],
      };

    // ✅ NUEVO: eliminar favorito
    case "REMOVE_FAVORITE":
      return {
        ...store,
        favorites: store.favorites.filter(
          (fav) =>
            fav.uid !== action.payload.uid || fav.type !== action.payload.type
        ),
      };

    case "SET_FAVORITES":
      return {
        ...store,
        favorites: action.payload,
      };

    default:
      console.error("Acción desconocida:", action);
      throw Error("Unknown action.");
  }
}
