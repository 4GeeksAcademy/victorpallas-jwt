// components/StarCard.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { addFavorite, deleteFavorite, loadFavorites } from "../fetch/favorites.js";

const StarCard = ({ uid, name, type }) => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        if (store.token && store.favorites.length === 0) {
            loadFavorites(dispatch);
        }
    }, [store.token]);

    const isFavorite = store.favorites.some(
        (fav) => fav.uid === uid && fav.type === type
    );

    const handleFavorite = () => {
        if (isFavorite) {
            deleteFavorite(dispatch, uid, type);
        } else {
            addFavorite(dispatch, { uid, name, type });
        }
    };

    return (
        <div className="card m-2" style={{ width: "18rem" }}>
            <img
                src={`https://starwars-visualguide.com/assets/img/${type}/${uid}.jpg`}
                className="card-img-top"
                alt={name}
                onError={(e) => {
                    e.target.src =
                        "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
                }}
            />
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <div className="d-flex justify-content-between">
                    <Link
                        to={`/details/${type}/${uid}`}
                        className="btn btn-outline-primary"
                    >
                        Más info
                    </Link>
                    <button
                        onClick={handleFavorite}
                        className={`btn ${isFavorite ? "btn-warning" : "btn-outline-warning"
                            }`}
                    >
                        {isFavorite ? "💛" : "🤍"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StarCard;
