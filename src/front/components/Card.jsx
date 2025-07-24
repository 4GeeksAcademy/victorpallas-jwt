import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { addFavorite, deleteFavorite } from "../fetch/favorites.js";

const Card = ({ item, type }) => {
    const { store, dispatch } = useGlobalReducer();

    // Identificar si el item está en favoritos
    const isFavorite = store.favorites.some(
        (fav) => fav.uid === item.uid && fav.type === type
    );

    // Alternar estado de favorito
    const toggleFavorite = () => {
        if (isFavorite) {
            deleteFavorite(dispatch, item.uid, type);
        } else {
            addFavorite(dispatch, {
                uid: item.uid,
                name: item.name,
                type: type,
            });
        }
    };

    return (
        <div className="card m-2" style={{ width: "18rem" }}>
            <img
                src={`https://starwars-visualguide.com/assets/img/${type}/${item.uid}.jpg`}
                className="card-img-top"
                alt={item.name}
                onError={(e) => {
                    e.target.src =
                        "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
                }}
            />
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <div className="d-flex justify-content-between align-items-center">
                    <Link
                        to={`/details/${type}/${item.uid}`}
                        className="btn btn-outline-primary btn-sm"
                    >
                        Más info
                    </Link>
                    <button
                        onClick={toggleFavorite}
                        className={`btn btn-sm ${isFavorite ? "btn-warning" : "btn-outline-warning"}`}
                        title={isFavorite ? "Eliminar de favoritos" : "Añadir a favoritos"}
                    >
                        {isFavorite ? "💛" : "🤍"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
