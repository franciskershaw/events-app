import "./App.css";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import PrivateRoute from "./components/layout/PrivateRoute/PrivateRoute";
import SharedLayout from "./components/layout/SharedLayout/SharedLayout";
import Auth from "./pages/Auth/Auth";
import Connections from "./pages/Connections/Connections";
import Events from "./pages/Events/Events";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
    </Router>
  );
}

export default App;
