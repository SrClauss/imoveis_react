import { useState, useEffect } from "react";
import DropFile from "./components/dropFile";
import { invoke } from "@tauri-apps/api";
import { TextField, Tooltip } from "@mui/material";
import MainScreen from "./pages/MainScreen";
import ConfigPesos from "./pages/ConfigPesos";
import { json } from "react-router-dom";

import { dialog } from "@tauri-apps/api";


export default function App() {



    const [compilado, setCompilado] = useState([]);
    const [tela, setTela] = useState(0);
    const [hasCompletedSheet, setHasCompletedSheet] = useState(false);
    const [oldData, setOldData] = useState([]);



    /*
    int32.parse("1") // 1
    fn classify(data: String, old_data:String,  peso:String, max_ativo:i32, max_novo:i32) -> Result<String, String> */

    const handleCalculate = (pesos, config) => {
        if (!hasCompletedSheet) {
            dialog.message("Por favor, carregue os arquivos necessários para prosseguir").then(_ => console.log(_))
            return;
        }
        console.log("Calculando")

        const oldDataStr = oldData.length != 0 ? JSON.stringify(oldData) : JSON.stringify(compilado);
        const data = JSON.stringify(compilado);
        const peso = JSON.stringify(pesos);
        const maxAtivo = config.maxDiasNovo
        const maxNovo = config.maxDiasAtualizado;
        invoke("classify", {
            data: data,
            oldData: oldDataStr,
            peso: peso,
            maxAtivo: parseInt(maxAtivo),
            maxNovo: parseInt(maxNovo)
        }).then((res) => {
            dialog.save({filters:[{name: "Excel Files", extensions:["xlsx"]}]}).then((fileName)=>{

                {/*fn save_xlsx(data: String, path: String) -> Result<(), String>{ */}
                invoke("save_xlsx", {data: res, path: fileName}).then((res)=>{console.log(res)}).catch((err)=>{console.log(err)})


            }).catch((err)=>{console.log(err)})
        })






    }


    return (
        <div>


            <MainScreen
                hidden={tela != 0}
                onCompiladoGerado={(compilado) => setCompilado(compilado)}
                onCompleteSheets={(_) => setHasCompletedSheet(_)}
                onSetTela={() => setTela(1)}
                onLoadOldData={(oldData) => setOldData(oldData)}

            />

            <ConfigPesos
                hidden={tela != 1}
                onSetTela={() => setTela(0)}
                hasCompletedSheets={hasCompletedSheet}
                compilado={compilado}
                onCalculate={handleCalculate}

            />

        </div >

    )
}

