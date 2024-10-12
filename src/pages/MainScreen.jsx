import DropFile from "../components/dropFile"
import { invoke } from "@tauri-apps/api"
import React, { useEffect, useState } from "react"
import { NavigationContext } from "../NavigationContext"
export default function MainScreen({hidden, onCompleteSheets, onSendCompilado, onLoadOldFile, compilado }) {

    const {setActiveScreen} = React.useContext(NavigationContext)
  

 
    const handleGoToDashBoard = () => {
        if (compilado.length == 0) {
            alert("Por favor, carregue os arquivos necessários para prosseguir")
            return
        }
        
    }

    return (
        <div  className={`flex flex-col w-full justify-center mt-3 ${hidden? "hidden":""}`} >

            <div className="flex w-full justify-center">
                <img src="img/casa_alta.png" alt="Casa Alta Imoveis" width={'14%'} />

            </div>
        
            <DropFile 
            onCompiladoGerado={onSendCompilado}
            onCompleteSheets={onCompleteSheets}
            onLoadOldFile={onLoadOldFile}
/>

            <div className="flex w-full justify-center mt-5">
                <button
                    onClick={handleGoToDashBoard}
                    id="btn-criterios"
                    className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">Ver Estatísticas</button>
            </div>
           

        </div>

    )
}