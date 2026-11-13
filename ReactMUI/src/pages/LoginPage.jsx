import { useState } from "react";
import {
  Alert,
  Button,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import api, {
  getApiErrorMessage,
  getApiFieldErrors,
} from "../api/axios";

export default function LoginPage({ onAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const location = useLocation();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const response = await api.post("/login", { email, password });
      const token = response.data?.access_token ?? response.data?.token;
      const user = response.data?.user;

      if (!token || !user) {
        throw new Error("The API did not return a valid sign-in session.");
      }

      onAuthenticated(token, user);
      navigate(location.state?.from?.pathname ?? "/", { replace: true });
    } catch (requestError) {
      setFieldErrors(getApiFieldErrors(requestError));
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to sign in. Check your email and password."
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: 440, mx: "auto", p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            Sign in
          </Typography>
          {location.state?.message && (
            <Alert severity="info">{location.state.message}</Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/register">
              Register
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </main>
  );
}
