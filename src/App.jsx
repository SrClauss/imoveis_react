import { useState, useEffect } from "react";
import React from "react";
import { invoke } from "@tauri-apps/api";
import MainScreen from "./pages/MainScreen";
import ConfigPesos from "./pages/ConfigPesos";
import DashBoard from "./pages/DashBoard";
import { dialog } from "@tauri-apps/api";
import { NavigationProvider, NavigationContext } from "./NavigationContext";

export default function App() {
  const [compilado, setCompilado] = useState([]);
  const [hasCompletedSheet, setHasCompletedSheet] = useState(false);
  const [oldData, setOldData] = useState([]);

useEffect(() => {
   console.log("compilado", compilado)

}, [compilado])
  

  const handleCalculate = (pesos) => {
    if (!hasCompletedSheet) {
      dialog
        .message("Por favor, carregue os arquivos necessários para prosseguir")
        .then((_) => console.log(_));
      return;
    }

    const oldDataStr =
      oldData.length != 0 ? JSON.stringify(oldData) : JSON.stringify(compilado);
    const data = JSON.stringify(compilado);
    const peso = JSON.stringify(pesos);

    invoke("classify", {
      data: data,
      oldData: oldDataStr,
      peso: peso,
    }).then((res) => {
      dialog
        .save({ filters: [{ name: "Excel Files", extensions: ["xlsx"] }] })
        .then((fileName) => {
          invoke("save_xlsx", { data: res, path: fileName })
            .then((res) => {
              console.log(res);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };
  const ScreenRenderer = () => {
    const { activeScreen } = React.useContext(NavigationContext);

    switch (activeScreen) {
      case "MainScreen":
        return (
          <MainScreen
            onCompleteSheets={(_) => setHasCompletedSheet(_)}
            onLoadOldData={(oldData) => setOldData(oldData)}
            onSendCompilado={setCompilado}
            compilado={compilado}
                     
          />
        );

      case "ConfigPesos":
        return (
          <ConfigPesos
            hasCompletedSheets={hasCompletedSheet}
            onCalculate={handleCalculate}
          />
        );
      case "DashBoard":
        return <DashBoard />;
      default:
        return null;
    }
  };

  return (
    <NavigationProvider>
      <ScreenRenderer />
    </NavigationProvider>
  );
}
