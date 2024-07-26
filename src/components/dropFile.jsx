"use client";
import { invoke } from "@tauri-apps/api";
import { dialog } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import { useRef } from "react";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { fs } from "@tauri-apps/api";
import AlertDialog from "./alertDialog";
import { BaseDirectory } from "@tauri-apps/api/fs";
export default function DropFile({ onCompiladoGerado, onCompleteSheets, onLoadOldFile }) {


    const [showDialog, setShowDialog] = useState(false);
    const [sheets, setSheets] = useState([]);
    const [file, setFile] = useState(null);
    const dropRef = useRef(null);
    const [hadImoveis, setHadImoveis] = useState(null);
    const [hadVisitas, setHadVisitas] = useState(null);
    const [hadAnuncios, setHadAnuncios] = useState(null);
    const [hadOldFile, setHadOldFile] = useState(null);
    const [fileImoveis, setFileImoveis] = useState("");
    const [fileAnuncios, setFileAnuncios] = useState("");
    const [fileVisitas, setFileVisitas] = useState("");
    const [fileOld, setFileOld] = useState("");



    useEffect(() => {
        if (hadImoveis && hadVisitas && hadAnuncios) {
            onCompleteSheets(true);
            let comp = []

            hadImoveis.forEach((item) => {

                const reg = {
                    status: item.status,
                    referencia: item.referencia,
                    tipo: item.tipo,
                    bairro: item.bairro,
                    venda: item.r_venda,
                    locacao: item.r_locacao,
                    criacao: item.data_de_cadastro,
                    ultimaAtualizacao: item.data_de_atualizacao,
                    area: item.area,
                    vendaPorM2: item.r_venda/item.area,
                    locacaoPorM2: item.r_locacao/item.area,


                }
                let anunc = hadAnuncios.filter((item) => { return item.codigo_do_imovel === reg.referencia });

                if (anunc.length > 0) {
                    reg.visualizacoes = anunc[0].total_de_visualizacoes;
                    reg.contatos = anunc[0].total_de_contatos;


                }
                else {
                    reg.visualizacoes = 0;
                    reg.contatos = 0;
                }

                let visitas = hadVisitas.filter((item) => { return item.ref_imovel == reg.referencia });

                reg.numVisitas = 0;
                reg.visitasConcluidas = 0;
                reg.visitasCanceladas = 0;
                reg.visitasAguardando = 0;
                reg.interessou = 0;
                reg.interessouGerouProposta = 0;
                reg.naoInteressou = 0;
                reg.totalConservacao = 0;
                reg.mediaConservacao = 0;
                reg.totalLocalizacao = 0;
                reg.mediaLocalizacao = 0;
                reg.totalAvaliacao = 0;
                reg.mediaAvaliacao = 0;
                if (visitas.length > 0) {
                    visitas.forEach((vis) => {
                        reg.numVisitas++;
                        if (vis.status === "Concluido") {
                            reg.visitasConcluidas++;
                        }
                        if (vis.status === "Cancelado") {
                            reg.visitasCanceladas++;
                        }
                        if (vis.status === "Aguardando") {
                            reg.visitasAguardando++;
                        }
                        if (vis.interesse.toLowerCase() === "interessou") {
                            reg.interessou++;
                        }
                        if (vis.interesse.toLowerCase() === "interessou e gerou proposta") {
                            reg.interessouGerouProposta++;
                        }
                        if (vis.interesse.toLowerCase() === "não interessou") {
                            reg.naoInteressou++;
                        }
                        if (!isNaN(parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__conservacao))) {
                            reg.totalConservacao += vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__conservacao;

                        }
                        if (!isNaN(parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__localizacao))) {


                            reg.totalLocalizacao += vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__localizacao;
                        }


                        if (isNaN(parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__valor))) {
                            reg.totalAvaliacao += vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__valor;

                        }

                    })
                }
                if (reg.visitasConcluidas > 0) {
                    reg.mediaConsevacao = reg.totalConservacao / reg.visitasConcluidas;
                }
                else {
                    reg.mediaConsevacao = 0;
                }


                if (reg.visitasConcluidas > 0) {
                    reg.mediaLocalizacao = reg.totalLocalizacao / reg.visitasConcluidas;
                }
                else {
                    reg.mediaLocalizacao = 0;
                }
                if (reg.visitasConcluidas > 0) {
                    reg.mediaAvaliacao = reg.totalAvaliacao / reg.visitasConcluidas;
                }
                else {
                    reg.mediaAvaliacao = 0;
                }
                reg.avaliacaoSubjetiva = 0;


                comp.push(reg);

            })




            console.log(comp);
            onCompiladoGerado(comp)

        }




    }, [hadImoveis, hadVisitas, hadAnuncios]);


    const processXlsx = (sheet) => {

        if (sheet === "Anúncios") {
            setFileAnuncios(file.split("\\")[file.split("\\").length - 1]);
            invoke("read_sheet_to_hash_vector", { path: file, sheetName: sheet }).then((res) => {
                const data = JSON.parse(res);

                setHadAnuncios(data);
            }).catch((err) => {
                console.log(err);
            })
            return;

        }

        if (sheet === "Imoveis") {
            setFileImoveis(file.split("\\")[file.split("\\").length - 1]);
            invoke("read_sheet_to_hash_vector", { path: file, sheetName: sheet }).then((res) => {
                const data = JSON.parse(res);

                setHadImoveis(data);
            }).catch((err) => {
                console.log(err);
            })
            return;

        }



        if (sheet === "Visitas") {
            setFileVisitas(file.split("\\")[file.split("\\").length - 1]);
            invoke("read_sheet_to_hash_vector", { path: file, sheetName: sheet }).then((res) => {
                const data = JSON.parse(res);

                setHadVisitas(data);
            }).catch((err) => {
                console.log(err);
            })
            return;
        }
        if (sheet === "Ranking") {
            setFileOld(file.split("\\")[file.split("\\").length - 1]);
            invoke("read_sheet_to_hash_vector", { path: file, sheetName: sheet }).then((res) => {
                const data = JSON.parse(res);
                onLoadOldFile(data);
                setHadOldFile(data);
            }).catch((err) => {
                console.log(err);
            })

            return;
        }


    }
    const handleClickDrop = () => {

        if (!showDialog) {


            appLocalDataDir().then((folder) => {
                fs.exists(`${folder}config.json`).then((exists) => {
                    if (exists) {

                        fs.readTextFile(`${folder}config.json`).then((file) => {

                            fs.readTextFile(`${folder}config.json`).then((config) => {

                                const configJson = JSON.parse(config);
                                dialog.open({
                                    title: "Selecione o arquivo xlsx",
                                    defaultPath: `${configJson.lastPath}`,
                                    directory: false,
                                    filters: [
                                        { name: 'Excel Files', extensions: ['xlsx', "xls", "xlsm"] }
                                    ]

                                }).then((res) => {
                                    const lastIndex = res.lastIndexOf("\\")
                                    const path = res.substring(0, lastIndex + 1)
                                    fs.readTextFile(`${folder}config.json`).then((config) => {
                                        const configJson = JSON.parse(config);
                                        configJson.lastPath = path;
                                        fs.writeFile(`${folder
                                            }config.json`, JSON.stringify(configJson), { dir: BaseDirectory.AppLocalData }).then((res) => {
                                                console.log("Arquivo de configuração criado com sucesso")
                                            }).catch((err) => {
                                                console.log(err)
                                            })
                                    }).catch((err) => {
                                        console.log(err);
                                    })
                                    invoke("get_sheets_names", { dir: res }).then((sheets) => {
                                        const sheets_json = JSON.parse(sheets);
                                        setSheets(sheets_json);
                                        setShowDialog(true);
                                        setFile(res);
                                    }).catch((err) => {
                                        console.log(err);
                                    })


                                }).catch((err) => {
                                    console.log(err);
                                })
                            })
                        }).catch((err) => {
                            console.log(`Erro ao ler arquivo de configuração: ${err}`)
                        })
                    }
                    else {
                        dialog.open({
                            title: "Selecione o arquivo xlsx",
                            defaultPath: `${"C:\\"}`,
                            directory: false,
                            filters: [
                                { name: 'Excel Files', extensions: ['xlsx', "xls", "xlsm"] }
                            ]

                        }).then((res) => {
                            const lastIndex = res.lastIndexOf("\\")
                            const path = res.substring(0, lastIndex + 1)
                            const config = {
                                lastPath: path
                            }
                            fs.writeFile(`${folder}config.json`, JSON.stringify(config), { dir: BaseDirectory.AppLocalData }).then((res) => {
                                console.log("Arquivo de configuração criado com sucesso")
                            }).catch((err) => {
                                console.log(err)
                            })
                        }).catch((err) => {
                            console.log(err);
                        })
                    }

                })
            })
        }





    }
    const getWindowPosition = async () => {
        const win = getCurrent();
        const outerPosition = await win.outerPosition();
        return outerPosition;
    }
    const handleDragOver = async (e) => {

        const { x, y } = await getWindowPosition();

        invoke("get_mouse_position", { wx: x, wy: y }).then((res) => {
            const position = JSON.parse(res);
            const dropPosition = dropRef.current.getBoundingClientRect();


            if (position.x >= dropPosition.x && position.x <= dropPosition.x + dropPosition.width && position.y >= dropPosition.y && position.y <= dropPosition.y + dropPosition.height) {
                const file = e.payload;
                setFile(file[0]);
                invoke("get_sheets_names", { dir: file[0] }).then((res) => {
                    const sheets = JSON.parse(res);
                    setSheets(sheets);
                    setShowDialog(true);
                }).catch((err) => {
                    console.log(err);
                });


            }
            else {
                console.log("Fora da area de drop");
            }


        });
    }

    useEffect(() => {

        listen("tauri://file-drop", handleDragOver);

    }, []);

    return (
        <div onClick={handleClickDrop} ref={dropRef} className="p-10">

            <div className="w-full p-10 border border-amber-900 border-dashed flex justify-center rounded-md">

                <div className="flex flex-row gap-2">

                    <div id="dropimoveis" className="border">

                        <div className=" flex justify-center">
                            <img src={hadImoveis ? "img/archive.png" : "img/no_archive.png"} alt="Imoveis" width={'70%'} />
                        </div>
                        <div className="w-full text-center">Imoveis</div>
                        <div className="w-full text-xs text-center"> {fileImoveis}</div>
                    </div>
                    <div id="dropvisitas" className="border">
                        <div className=" flex justify-center">
                            <img src={hadVisitas ? "img/archive.png" : "img/no_archive.png"} alt="Visitas" width={'70%'} />
                        </div>
                        <div className="w-full text-center">Visitas</div>
                        <div className="w-full text-xs text-center"> {fileVisitas}</div>
                    </div>
                    <div id="dropzap" className="border">
                        <div className=" flex justify-center">
                            <img src={hadAnuncios ? "img/archive.png" : "img/no_archive.png"} alt="Zap" width={'70%'} />
                        </div>
                        <div className="w-full text-center">Zap</div>
                        <div className="w-full text-xs text-center"> {fileAnuncios}</div>
                    </div>
                    <div id="dropold" className="border">
                        <div className=" flex justify-center">
                            <img src={hadOldFile ? "img/archive.png" : "img/no_archive.png"} alt="Old" width={'70%'} />
                        </div>
                        <div className="w-full text-center">Ultimo Excel</div>
                        <div className="w-full text-xs text-center"> {fileOld}</div>
                    </div>



                </div>
                <AlertDialog open={showDialog} onClose={setShowDialog} onSend={processXlsx} sheets={sheets} />
            </div>





        </div >
    )
}