import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import NotFoundPage from "./pages/NotFoundPage";
import api, { clearAuthSession, getStoredUser, setAuthSession } from "./api/axios";

export default function App() {
  const [user, setUser] = useState(getStoredUser);

  const handleAuthenticated = (token, authenticatedUser) => {
    setAuthSession(token, authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleSignOut = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Clear the local session even if the server token has already expired.
    } finally {
      clearAuthSession();
      setUser(null);
    }
  };

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            user={user}
            onAuthenticated={handleAuthenticated}
            onSignOut={handleSignOut}
          />
        }
      >
        <Route path="/" element={<ProductListPage isAdmin={user?.role === "admin"} />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}