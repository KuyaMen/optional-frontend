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
import { Link as RouterLink, useNavigate } from "react-router-dom";
import api, {
  getApiErrorMessage,
  getApiFieldErrors,
} from "../api/axios";

export default function RegisterPage({ onAuthenticated }) {
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    if (form.password !== form.password_confirmation) {
      setFieldErrors({ password_confirmation: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/register", form);
      const token = response.data?.access_token ?? response.data?.token;
      const user = response.data?.user;

      if (token && user) {
        onAuthenticated(token, user);
        navigate("/", { replace: true });
      } else {
        navigate("/login", {
          replace: true,
          state: { message: "Your account was created. Sign in to continue." },
        });
      }
    } catch (requestError) {
      setFieldErrors(getApiFieldErrors(requestError));
      setError(
        getApiErrorMessage(requestError, "Unable to create your account.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container">
      <Paper component="form" onSubmit={handleSubmit} sx={{ maxWidth: 520, mx: "auto", p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" component="h1">
            Create an account
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="First name"
            name="firstname"
            autoComplete="given-name"
            value={form.firstname}
            onChange={handleChange}
            error={Boolean(fieldErrors.firstname)}
            helperText={fieldErrors.firstname}
            required
            fullWidth
          />
          <TextField
            label="Last name"
            name="lastname"
            autoComplete="family-name"
            value={form.lastname}
            onChange={handleChange}
            error={Boolean(fieldErrors.lastname)}
            helperText={fieldErrors.lastname}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
            required
            fullWidth
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
            required
            fullWidth
          />
          <TextField
            label="Confirm password"
            name="password_confirmation"
            type="password"
            autoComplete="new-password"
            value={form.password_confirmation}
            onChange={handleChange}
            error={Boolean(fieldErrors.password_confirmation)}
            helperText={fieldErrors.password_confirmation}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
          <Typography variant="body2" sx={{ textAlign: "center" }}>
            Already registered?{" "}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </main>
  );
}
