import { Link } from "react-router-dom";
import AuthButton from "./AuthButton.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store } = useGlobalReducer();
	const userName = store?.userInfo?.user?.name || store?.userInfo?.user?.email || null;

	return (
		<nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
			<div className="container-fluid">
				<Link to="/" className="navbar-brand mb-0 h1">
					StarWars Blog
				</Link>

				<div className="d-flex gap-3 align-items-center">

					{/* Enlaces principales */}
					<Link to="/people" className="btn btn-outline-secondary btn-sm">
						Personajes
					</Link>
					<Link to="/planets" className="btn btn-outline-secondary btn-sm">
						Planetas
					</Link>
					<Link to="/vehicles" className="btn btn-outline-secondary btn-sm">
						Vehículos
					</Link>

					{/* Lista de favoritos */}
					<Link to="/favorites" className="btn btn-outline-warning btn-sm">
						⭐ Mis favoritos
					</Link>

					{/* Saludo al usuario logueado */}
					{userName && (
						<span className="text-muted fw-bold small">
							Hola, {userName}
						</span>
					)}

					{/* Botón Login/Logout */}
					<AuthButton />
				</div>
			</div>
		</nav>
	);
};
