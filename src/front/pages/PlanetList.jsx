import React, { useEffect, useState } from "react";
import StarCard from "../components/StarCard";

export const PlanetList = () => {
    const [planets, setPlanets] = useState([]);

    useEffect(() => {
        fetch("https://www.swapi.tech/api/planets")
            .then(res => res.json())
            .then(data => setPlanets(data.results))
            .catch(err => console.error("Error fetching planets:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h2>Planetas</h2>
            <div className="d-flex flex-wrap">
                {planets.map(planet => (
                    <StarCard
                        key={planet.uid}
                        uid={planet.uid}
                        name={planet.name}
                        type="planets"
                    />
                ))}
            </div>
        </div>
    );
};