import Dropzone from "react-dropzone";
import { invoke } from "@tauri-apps/api";

const MainScreen = () => {

   

    return (
        <div className="container">

            <div className="flex w-full justify-center">
                <img src="img/casa_alta.png" alt="Casa Alta Imoveis" width={'14%'} />

            </div>


            <div className="p-10">
                <Dropzone onDrop={(e) => console.log(e)}>
                    {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()} className="w-full p-10 border border-amber-900 border-dashed flex justify-center rounded-md">
                            <input {...getInputProps()} />
                            <p>Arraste as planilhas aqui</p>
                        </div>
                    )}
                </Dropzone>


                <div className="flex flex-col justify-start border border-amber-900 rounded-md mt-5">
                    <div className="w-36 px-text-left ml-5" style={{ marginTop: "-11px", backgroundColor: " #f6f6f6" }}>Arquivos Inseridos</div>
                    <div className="w-full flex flex-col justify-start gap-y-3 px-8 py-2">
                        <div className="flex flex-row">
                            <div>
                                <input type="checkbox" id="scales" name="scales" disabled />
                            </div>
                            <span className="ml-2">Imoveis</span>
                        </div>
                        <div className="flex flex-row">
                            <div>
                                <input type="checkbox" id="scales" name="scales" disabled />
                            </div>
                            <span className="ml-2">Clientes</span>
                        </div>
                        <div className="flex flex-row">

                            <div>
                                <input type="checkbox" id="scales" name="scales" disabled />
                            </div>
                            <span className="ml-2">Visitas</span>
                        </div>
                        <div className="flex flex-row">

                            <div>
                                <input type="checkbox" id="scales" name="scales" disabled />
                            </div>
                            <span className="ml-2">Zap</span>
                        </div>
                    </div>
                </div>

            </div>
            <div className="flex w-full justify-center mt-5 ">
                <button className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">Configurar Criterios</button>
            </div>
        </div>
    )
}

export default MainScreen;