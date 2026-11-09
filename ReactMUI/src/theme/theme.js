import { createTheme } from "@mui/material/styles";
 
const theme = createTheme({
  palette: {
    primary: { main: "#023020" },
    secondary: { main: "#E87524" },
    background: { default: "#636B2F" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
  },
});
 
export default theme;