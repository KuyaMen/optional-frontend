import { useEffect, useState } from "react";
import { AppBar, Badge, Button, Toolbar, Tooltip, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Link as RouterLink } from "react-router-dom";
import api, { getApiErrorMessage } from "../api/axios";

export default function Header({ user, onSignOut, cartVersion }) {
  const [signingOut, setSigningOut] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [cartError, setCartError] = useState("");

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let active = true;

    async function loadCartCount() {
      try {
        const response = await api.get("/carts");
        const items = response.data?.data ?? response.data;
        if (active) {
          setCartCount(
            Array.isArray(items)
              ? items.reduce((total, item) => total + Number(item.quantity), 0)
              : 0
          );
          setCartError("");
        }
      } catch (requestError) {
        if (active) {
          setCartError(getApiErrorMessage(requestError, "Unable to load your cart."));
        }
      }
    }

    loadCartCount();

    return () => {
      active = false;
    };
  }, [user, cartVersion]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await onSignOut();
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <AppBar position="sticky" elevation={1}>
      <Toolbar sx={{ width: "100%", maxWidth: 1200, mx: "auto" }}>
        <Typography
          component={RouterLink}
          to="/"
          variant="h6"
          sx={{ color: "white", textDecoration: "none", fontWeight: 800, flexGrow: 1 }}
        >
          OPTIONAL SHOP
        </Typography>
        <Button
          component={RouterLink}
          to="/"
          color="inherit"
          sx={{ color: "white" }}
        >
          Products
        </Button>
        {user ? (
          <>
            <Tooltip title={cartError || "View your cart"}>
              <Button
                component={RouterLink}
                to="/cart"
                color="inherit"
                aria-label={`Cart, ${user ? cartCount : 0} items`}
              >
                <Badge badgeContent={user ? cartCount : 0} color="secondary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
                <Typography component="span" sx={{ ml: 1 }}>
                  Cart
                </Typography>
              </Button>
            </Tooltip>
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, ml: 2 }}>
              {[user.firstname, user.lastname].filter(Boolean).join(" ") || user.name || user.email} ({user.role})
            </Typography>
            <Button color="inherit" onClick={handleSignOut} disabled={signingOut}>
              {signingOut ? "Signing out..." : "Sign out"}
            </Button>
          </>
        ) : (
          <>
            <Button component={RouterLink} to="/login" color="inherit">
              Sign in
            </Button>
            <Button component={RouterLink} to="/register" color="inherit">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}