import React from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import StarCard from "../components/StarCard";

export const FavoritesPage = () => {
  const { store } = useGlobalReducer();
  const { favorites } = store;

  return (
    <div className="container mt-4">
      <h2>Mis Favoritos</h2>
      {favorites.length === 0 ? (
        <p className="text-muted">No has agregado favoritos.</p>
      ) : (
        <div className="d-flex flex-wrap">
          {favorites.map((fav) => (
            <StarCard
              key={fav.uid + fav.type}
              uid={fav.uid}
              name={fav.name}
              type={fav.type}
            />
          ))}
        </div>
      )}
    </div>
  );
};
