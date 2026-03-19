import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Protected from "./components/Protected.jsx";

import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/edit" element={<Protected><EditProfile /></Protected>} />
          <Route path="/change-password" element={<Protected><ChangePassword /></Protected>} />
          <Route path="/delete" element={<Protected><DeleteAccount /></Protected>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
