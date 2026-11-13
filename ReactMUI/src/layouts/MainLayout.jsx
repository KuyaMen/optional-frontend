import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
 
export default function MainLayout({ user, onSignOut, cartVersion }) {
  return (
    <Box sx={{ minHeight: "100vh" }}>
      <Header
        user={user}
        onSignOut={onSignOut}
        cartVersion={cartVersion}
      />
      <Outlet />
    </Box>
  );
}