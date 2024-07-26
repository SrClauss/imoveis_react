import DropFile from "../components/dropFile"
import { invoke } from "@tauri-apps/api"
export default function MainScreen({ onCompiladoGerado, onSetTela, hidden, onCompleteSheets, onLoadOldData }) {

  
    return (
        <div className={`flex flex-col w-full justify-center mt-3 ${hidden ? "hidden" : ""}`} >

            <div className="flex w-full justify-center">
                <img src="img/casa_alta.png" alt="Casa Alta Imoveis" width={'14%'} />

            </div>

            <DropFile 
            onCompiladoGerado={(compilado) => onCompiladoGerado(compilado)} 
            onCompleteSheets={onCompleteSheets}
            onLoadOldData = {onLoadOldData}/>

            <div className="flex w-full justify-center mt-5">
                <button
                    onClick={() => onSetTela(1)}
                    id="btn-criterios"
                    className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">Configurar Criterios</button>
            </div>
           

        </div>

    )
}