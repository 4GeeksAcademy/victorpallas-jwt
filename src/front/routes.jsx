// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { Login } from "./pages/Login";
import { Details } from "./pages/Details";
import Favorites from "./pages/FavoritesPage";
import { AdminPanel } from "./pages/AdminPanel"; // ✅ nuevo componente
import { PeopleList } from "./pages/PeopleList";
import { PlanetList } from "./pages/PlanetList";
import { VehicleList } from "./pages/VehicleList";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/login" element={<Login />} />
      <Route path="/details/:type/:uid" element={<Details />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/admin" element={<AdminPanel />} /> {/* ✅ Ruta protegida para admins */}
      <Route path="/people" element={<PeopleList />} />
      <Route path="/planets" element={<PlanetList />} />
      <Route path="/vehicles" element={<VehicleList />} />

    </Route>
  )
);