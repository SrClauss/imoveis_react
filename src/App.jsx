import { useState, useEffect } from "react";
import React from "react";
import { invoke } from "@tauri-apps/api";
import MainScreen from "./Pages/MainScreen";
import { dialog } from "@tauri-apps/api";
import { NavigationProvider, NavigationContext } from "./NavigationContext";
import { ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import DashBoard from "./Pages/DashBoard";
import TabelaDinamica from "./Pages/TabelaDinamica";
import  LicenseProvider from "./LicenseContext";

const theme = createTheme( {
  palette: {
    mode: 'light',
    primary: {
      main: '#77430e',
    },
    secondary: {
      main: '#077f26',
    },
  },
  typography: {
    fontFamily: 'Roboto',
  },
});
export default function App() {
 



  const ScreenRenderer = () => {
    const { activeScreen } = React.useContext(NavigationContext);
    switch (activeScreen) {
      case "MainScreen":
        return <MainScreen />;
      case "DashBoard":
        return <DashBoard />;

      case "TabelaDinamica":
        return <TabelaDinamica />;
      default:
        return <MainScreen />;
    }
  };

  return (
    <LicenseProvider>
    <ThemeProvider theme={theme}>
      <NavigationProvider>
        <ScreenRenderer />
      </NavigationProvider>
    </ThemeProvider>
    </LicenseProvider>
  );
}
