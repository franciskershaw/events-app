import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import PrivateRoute from "./components/layout/PrivateRoute/PrivateRoute";
import SharedLayout from "./components/layout/SharedLayout/SharedLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<div>Organisy</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
