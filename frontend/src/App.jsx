import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CredentialsList from "./pages/CredentialsList";
import CredentialForm from "./pages/CredentialForm";
import CredentialDetail from "./pages/CredentialDetail";
import Nav from "./components/Nav";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("mv_token");
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div className="app-root">
      <Nav />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/credentials"
            element={
              <PrivateRoute>
                <CredentialsList />
              </PrivateRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/credentials/new"
            element={
              <PrivateRoute>
                <CredentialForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/credentials/:id/edit"
            element={
              <PrivateRoute>
                <CredentialForm editMode />
              </PrivateRoute>
            }
          />
          <Route
            path="/credentials/:id"
            element={
              <PrivateRoute>
                <CredentialDetail />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/credentials" replace />} />
        </Routes>
      </main>
    </div>
  );
}
