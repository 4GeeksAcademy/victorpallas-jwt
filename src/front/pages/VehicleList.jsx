import React, { useEffect, useState } from "react";
import StarCard from "../components/StarCard";

export const VehicleList = () => {
    const [vehicles, setVehicles] = useState([]);

    useEffect(() => {
        fetch("https://www.swapi.tech/api/vehicles")
            .then(res => res.json())
            .then(data => setVehicles(data.results))
            .catch(err => console.error("Error fetching vehicles:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h2>Vehículos</h2>
            <div className="d-flex flex-wrap">
                {vehicles.map(vehicle => (
                    <StarCard
                        key={vehicle.uid}
                        uid={vehicle.uid}
                        name={vehicle.name}
                        type="vehicles"
                    />
                ))}
            </div>
        </div>
    );
};
