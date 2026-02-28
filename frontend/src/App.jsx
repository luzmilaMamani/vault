// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CredentialsList from "./pages/CredentialsList";
import CredentialDetail from "./pages/CredentialDetail";
import CredentialForm from "./pages/CredentialForm";

function App() {
  return (
    <>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/credentials" element={<CredentialsList />} />
        <Route path="/credentials/new" element={<CredentialForm />} />
        <Route path="/credentials/:id" element={<CredentialDetail />} />
        <Route
          path="/credentials/:id/edit"
          element={<CredentialForm editMode={true} />}
        />
        <Route path="/" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
