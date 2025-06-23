import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";

import { ThemeProvider as CustomThemeProvider } from "./themeContext.jsx";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // or "dark"
    background: {
      default: "#ffffff",
    },
    text: {
      primary: "#000000",
    },
    primary: {
      main: "#1976d2",
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <CustomThemeProvider>
        <MUIThemeProvider theme={theme}>
          <App />
        </MUIThemeProvider>
      </CustomThemeProvider>
    </Provider>
  </React.StrictMode>
);
