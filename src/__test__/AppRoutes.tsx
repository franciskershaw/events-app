import { Route, Routes } from "react-router-dom";

import PrivateRoute from "../components/layout/PrivateRoute/PrivateRoute";
import SharedLayout from "../components/layout/SharedLayout/SharedLayout";
import Auth from "../pages/Auth/Auth";
import Connections from "../pages/Connections/Connections";
import Events from "../pages/Events/Events";

/**
 * Contains just the routes configuration from App.tsx without the Router component.
 * This is used for testing to avoid nested Router issues.
 */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SharedLayout />}>
        <Route index element={<Auth />} />
        <Route path="/events" element={<PrivateRoute />}>
          <Route index element={<Events />} />
        </Route>
        <Route path="/connections" element={<PrivateRoute />}>
          <Route index element={<Connections />} />
        </Route>
      </Route>
    </Routes>
  );
}
