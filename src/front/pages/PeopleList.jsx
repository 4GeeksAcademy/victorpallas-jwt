import React, { useEffect, useState } from "react";
import StarCard from "../components/StarCard";

export const PeopleList = () => {
    const [people, setPeople] = useState([]);

    useEffect(() => {
        fetch("https://www.swapi.tech/api/people")
            .then(res => res.json())
            .then(data => setPeople(data.results))
            .catch(err => console.error("Error fetching people:", err));
    }, []);

    return (
        <div className="container mt-4">
            <h2>Personajes</h2>
            <div className="d-flex flex-wrap">
                {people.map(person => (
                    <StarCard
                        key={person.uid}
                        uid={person.uid}
                        name={person.name}
                        type="characters"
                    />
                ))}
            </div>
        </div>
    );
};