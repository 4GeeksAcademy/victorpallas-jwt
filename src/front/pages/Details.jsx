import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const Details = () => {
  const { type, uid } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://www.swapi.tech/api/${type}/${uid}`)
      .then((res) => res.json())
      .then((data) => {
        setInfo(data.result);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching detail:", err);
        setLoading(false);
      });
  }, [type, uid]);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (!info) return <p className="text-center mt-4 text-danger">No se pudo cargar la información.</p>;

  const { properties, description } = info;

  return (
    <div className="container mt-5">
      <h2>{properties?.name}</h2>
      <img
        src={`https://starwars-visualguide.com/assets/img/${type}/${uid}.jpg`}
        className="img-fluid mb-3"
        alt={properties?.name}
        onError={(e) => {
          e.target.src = "https://starwars-visualguide.com/assets/img/big-placeholder.jpg";
        }}
      />

      <p>{description}</p>

      <ul className="list-group">
        {Object.entries(properties).map(([key, value]) => (
          <li key={key} className="list-group-item">
            <strong>{key.replace("_", " ")}: </strong> {value}
          </li>
        ))}
      </ul>
    </div>
  );
};
