import { useLayoutEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProductListPage from "./pages/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtectedRoute from "./components/ProtectedRoute";
import api, { clearAuthSession, getStoredUser, setAuthSession } from "./api/axios";

export default function App() {
  const [user, setUser] = useState(getStoredUser);
  const [cartVersion, setCartVersion] = useState(0);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      navigate("/login", {
        replace: true,
        state: { message: "Your session expired. Please sign in again." },
      });
    }

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  const handleAuthenticated = (token, authenticatedUser) => {
    setAuthSession(token, authenticatedUser);
    setUser(authenticatedUser);
  };

  const handleCartChange = () => {
    setCartVersion((version) => version + 1);
  };

  const handleSignOut = async () => {
    let message = "You have signed out.";
    try {
      await api.post("/logout");
    } catch (requestError) {
      message =
        requestError.response?.status === 401
          ? "Your session had already expired. You have been signed out."
          : "You have been signed out on this device, but the server could not confirm token revocation.";
    }

    clearAuthSession();
    setUser(null);
    navigate("/login", { replace: true, state: { message } });
  };

  return (
    <Routes>
      <Route
        element={
          <MainLayout
            user={user}
            onSignOut={handleSignOut}
            cartVersion={cartVersion}
          />
        }
      >
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onAuthenticated={handleAuthenticated} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <RegisterPage onAuthenticated={handleAuthenticated} />
            )
          }
        />
        <Route element={<ProtectedRoute user={user} />}>
          <Route
            index
            element={
              <ProductListPage
                isAdmin={user?.role === "admin"}
                onCartChange={handleCartChange}
              />
            }
          />
          <Route
            path="/products"
            element={
              <ProductListPage
                isAdmin={user?.role === "admin"}
                onCartChange={handleCartChange}
              />
            }
          />
          <Route
            path="/products/:id"
            element={
              <ProductDetailsPage
                isAdmin={user?.role === "admin"}
                onCartChange={handleCartChange}
              />
            }
          />
          <Route
            path="/cart"
            element={
              user?.role === "admin" ? (
                <Navigate to="/" replace />
              ) : (
                <CartPage onCartChange={handleCartChange} />
              )
            }
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}