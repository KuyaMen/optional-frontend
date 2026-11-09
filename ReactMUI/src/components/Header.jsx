import { useState } from "react";
import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import AuthDialog from "./AuthDialog";

export default function Header({ user, onAuthenticated, onSignOut }) {
  const [authOpen, setAuthOpen] = useState(false);

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
            <Typography variant="body2" sx={{ display: { xs: "none", sm: "block" }, ml: 2 }}>
              {user.firstname} {user.lastname} ({user.role})
            </Typography>
            <Button color="inherit" onClick={onSignOut}>
              Sign out
            </Button>
          </>
        ) : (
          <Button color="inherit" onClick={() => setAuthOpen(true)}>
            Sign in
          </Button>
        )}
      </Toolbar>
      <AuthDialog
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthenticated={onAuthenticated}
      />
    </AppBar>
  );
}