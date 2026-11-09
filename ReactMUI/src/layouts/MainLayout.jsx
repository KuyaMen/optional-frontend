import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
 
export default function MainLayout({ user, onAuthenticated, onSignOut }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header user={user} onAuthenticated={onAuthenticated} onSignOut={onSignOut} />
      <Outlet />
    </Box>
  );
}