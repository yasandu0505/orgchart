import App from "./App.jsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import ThemContext from "./themeContext.jsx";

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
      <ThemContext>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </ThemContext>
    </Provider>
  </React.StrictMode>
);
