import React, { useEffect, useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { privateFetch } from "../fetch/apiFetch"; // función que agrega el token a los headers

export const AdminPanel = () => {
    const { store } = useGlobalReducer();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({});

    useEffect(() => {
        if (!store.token) return;
        fetchUsers();
    }, [store.token]);

    const fetchUsers = async () => {
        try {
            const res = await privateFetch("/api/admin/users", store.token);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            } else {
                console.error("Error fetching users");
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
        try {
            const res = await privateFetch(`/api/admin/users/${id}`, store.token, "DELETE");
            if (res.ok) {
                setUsers(users.filter(user => user.id !== id));
            } else {
                console.error("Error al eliminar");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const startEdit = (user) => {
        setEditingUser(user.id);
        setForm({
            fullname: user.fullname,
            is_admin: user.is_admin,
            is_active: user.is_active
        });
    };

    const cancelEdit = () => {
        setEditingUser(null);
        setForm({});
    };

    const saveEdit = async (id) => {
        try {
            const res = await privateFetch(`/api/admin/users/${id}`, store.token, "PUT", form);
            if (res.ok) {
                const updated = await res.json();
                setUsers(users.map(u => u.id === id ? updated.user : u));
                cancelEdit();
            } else {
                console.error("Error actualizando usuario");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    if (!store.token) {
        return <div className="container mt-5"><h3>Acceso denegado</h3></div>;
    }

    if (loading) return <p className="text-center mt-4">Cargando usuarios...</p>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Panel de Administración</h2>
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Nombre completo</th>
                        <th>Admin</th>
                        <th>Activo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>
                                {editingUser === user.id ? (
                                    <input
                                        value={form.fullname}
                                        onChange={(e) => handleChange("fullname", e.target.value)}
                                        className="form-control"
                                    />
                                ) : (
                                    user.fullname
                                )}
                            </td>
                            <td>
                                {editingUser === user.id ? (
                                    <input
                                        type="checkbox"
                                        checked={form.is_admin}
                                        onChange={(e) => handleChange("is_admin", e.target.checked)}
                                    />
                                ) : (
                                    user.is_admin ? "Sí" : "No"
                                )}
                            </td>
                            <td>
                                {editingUser === user.id ? (
                                    <input
                                        type="checkbox"
                                        checked={form.is_active}
                                        onChange={(e) => handleChange("is_active", e.target.checked)}
                                    />
                                ) : (
                                    user.is_active ? "Sí" : "No"
                                )}
                            </td>
                            <td>
                                {editingUser === user.id ? (
                                    <>
                                        <button
                                            className="btn btn-success btn-sm me-2"
                                            onClick={() => saveEdit(user.id)}
                                        >
                                            Guardar
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                                            Cancelar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => startEdit(user)}
                                    >
                                        Editar
                                    </button>
                                )}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(user.id)}
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
