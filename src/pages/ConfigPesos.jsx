import { Tooltip, TextField } from "@mui/material"
import { useState, useEffect } from "react"
import { appLocalDataDir } from "@tauri-apps/api/path"
import { writeFile, readTextFile } from "@tauri-apps/api/fs"

export default function ConfigPesos({ hidden, onSetTela, onCalculate }) {
    const [enabled, setEnabled] = useState(false)
    const [pesos, setPesos] = useState({})
    const [config, setConfig] = useState({})



    useEffect(() => {

        appLocalDataDir().then((appDataDirectory) => {
            const path = `${appDataDirectory}\config.json`
            readTextFile(path).then((data) => {
                const json = JSON.parse(data)
                if (json.pesos){
                    setPesos(json.pesos)
                }
                else{
                    setPesos({
                         


                    

                    })
                }
                setConfig(json.config)
            }).catch((err) => {
                console.error("Erro ao ler arquivo", err)
                setPesos({
                    ativo: 0,
                    cont_tipo_bairro: 0,
                    cont_bairro: 0,
                    diminuiu_preco: 0,
                    visualizacoes: 0,
                    novo: 0,
                    atualizado: 0,
                    contatos: 0,
                    visitas: 0,
                    total_conservacao: 0,
                    media_conservacao: 0,
                    total_localizacao: 0,
                    media_localizacao: 0,
                    total_avaliacao: 0,
                    media_avaliacao: 0,
                    avaliacao_subjetiva: 0,
                    venda_por_m2: 0,
                    locacao_por_m2: 0,
                })
                setConfig({
                    maxDiasNovo: 0,
                    maxDiasAtualizado: 0,
                    superAnuncios: 0,
                    anunciosDestacados: 0,
                    totalAnuncios: 0
                })
            }).catch((err) => {
                console.error("Erro ao obter diretório de dados", err)
            })

        }).catch((err) => {
            console.error("Erro ao obter diretório de dados", err)
        })
    }, [])




    const handleSave = async () => {
        setEnabled(!enabled)
        if (enabled) {
            const pesosAndConfig = {
                pesos: pesos,
                config: config
            }
            // Agora esperamos que a Promise de appDataDir seja resolvida antes de construir o caminho
            const appDataDirectory = await appLocalDataDir();
            const path = appDataDirectory + "\\config.json";
            writeFile({
                path: path,
                contents: JSON.stringify(pesosAndConfig)
            }).then((_) => {
                console.log("Arquivo salvo com sucesso")
            }).catch((err) => {
                console.error("Erro ao salvar arquivo", err)
            })
        }
    }


    return (
        config && pesos ?
            <div className={`flex-col p-3 w-full justify-center ${hidden ? "hidden" : ""} `}>

                <div className="flex w-full justify-center">
                    <img src="img/casa_alta.png" alt="Casa Alta Imoveis" width={'5%'} />
                </div>
                <div>
                    <div className="flex w-full justify-center mt-3">
                        <p className="text-md">Ajuste os pesos de cada critério para a avaliação dos imóveis</p>
                    </div>

                    <div className={`p-5`}>
                        <div className="w-full py-10 border border-amber-900 border-dashed flex flex-col justify-center rounded-md overflow-x-auto">
                            <div className="mx-3 flex flex-row">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Dá um peso para itens ativos">
                                            <TextField disabled={!enabled} id="ativo" label="Ativo" type="number" style={{ width: "120px" }} value={pesos.ativo}
                                                onChange={(e) => setPesos({ ...pesos, ativo: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Imóveis do mesmo tipo no mesmo bairro">
                                            <TextField disabled={!enabled} id="cont_tipo_bairro" label="Bairro/Tipo" type="number" style={{ width: "120px" }}
                                                value={pesos.cont_tipo_bairro}
                                                onChange={(e) => setPesos({ ...pesos, cont_tipo_bairro: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Imóveis do mesmo bairro">
                                            <TextField disabled={!enabled} id="cont_bairro" label="Bairro" type="number" style={{ width: "120px" }}
                                                value={pesos.cont_bairro}
                                                onChange={(e) => setPesos({ ...pesos, cont_bairro: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>

                                </div>

                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Imóveis que diminuiram de preço">
                                            <TextField disabled={!enabled} id="diminuiu_preco" label="Redução/Preço" type="number" style={{ width: "120px" }}

                                                value={pesos.diminuiu_preco}
                                                onChange={(e) => setPesos({ ...pesos, diminuiu_preco: e.target.value })}

                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Visualizações no Zap">
                                            <TextField disabled={!enabled} id="visualizacoes" label="Visualizações" type="number" style={{ width: "120px" }}
                                                value={pesos.visualizacoes}
                                                onChange={(e) => setPesos({ ...pesos, visualizacoes: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Novos Cadastros baseados em um valor arbitrário de dias">
                                            <TextField disabled={!enabled} id="novo" label="Novo" type="number" style={{ width: "120px" }}
                                                value={pesos.novo}
                                                onChange={(e) => setPesos({ ...pesos, novo: e.target.value })}

                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>

                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Ultima Atualização baseados em um valor arbitrário de dias">
                                            <TextField disabled={!enabled} id="atualizado" label="Atualizado" type="number" style={{ width: "120px" }}

                                                value={pesos.atualizado}
                                                onChange={(e) => setPesos({ ...pesos, atualizado: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Contatos com a imobiliária">
                                            <TextField disabled={!enabled} id="contatos" label="Contatos" type="number" style={{ width: "120px" }}
                                                value={pesos.contatos}
                                                onChange={(e) => setPesos({ ...pesos, contatos: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>

                                    <div>
                                        <Tooltip title="Visitas que foram marcadas e não necessáriamente feitas">
                                            <TextField disabled={!enabled} id="visitas" label="Visitas" type="number" style={{ width: "120px" }}
                                                value={pesos.visitas}
                                                onChange={(e) => setPesos({ ...pesos, visitas: e.target.value })}

                                            />

                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Total de conservação do imóvel">
                                            <TextField disabled={!enabled} id="total_conservacao" label="Conservação" type="number" style={{ width: "120px" }}
                                                value={pesos.total_conservacao}
                                                onChange={(e) => setPesos({ ...pesos, total_conservacao: e.target.value })}

                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Média de Conservação do imóvel">
                                            <TextField disabled={!enabled} id="media_conservacao" label="Média Cons." type="number" style={{ width: "120px" }}
                                                value={pesos.media_conservacao}
                                                onChange={(e) => setPesos({ ...pesos, media_conservacao: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Total de localização do imóvel">
                                            <TextField disabled={!enabled} id="total_localizacao" label="Localização" type="number" style={{ width: "120px" }}
                                                value={pesos.total_localizacao}
                                                onChange={(e) => setPesos({ ...pesos, total_localizacao: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>

                                </div>
                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Média de localização do imóvel">
                                            <TextField disabled={!enabled} id="media_localizacao" label="Média Local." type="number" style={{ width: "120px" }}
                                                value={pesos.media_localizacao}
                                                onChange={(e) => setPesos({ ...pesos, media_localizacao: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Total de avaliação do imóvel">
                                            <TextField disabled={!enabled} id="total_avaliacao" label="Avaliação" type="number" style={{ width: "120px" }}
                                                value={pesos.total_avaliacao}
                                                onChange={(e) => setPesos({ ...pesos, total_avaliacao: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Média de avaliação do imóvel">
                                            <TextField disabled={!enabled} id="media_avaliacao" label="Média Aval." type="number" style={{ width: "120px" }}
                                                value={pesos.media_avaliacao}
                                                onChange={(e) => setPesos({ ...pesos, media_avaliacao: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>

                                </div>

                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Avaliação subjetiva do imóvel">
                                            <TextField disabled={!enabled} id="avaliacao_subjetiva" label="Aval. Subjetiva" type="number" style={{ width: "120px" }}
                                                value={pesos.avaliacao_subjetiva}
                                                onChange={(e) => setPesos({ ...pesos, avaliacao_subjetiva: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Visitas que foram marcadas e que foram efetivadas">
                                            <TextField
                                                disabled={!enabled}
                                                id="visitasConcluidas"
                                                label="Visitas Concluídas"
                                                type="number"
                                                style={{ width: "120px" }}
                                                value={pesos.visitas_concluidas}
                                                onChange={(e) => setPesos({ ...pesos, visitas_concluidas: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Visitas que foram marcadas e que não foram concuidas">
                                            <TextField
                                                disabled={!enabled}
                                                id="visitasCanceladas"
                                                label="Visitas Canceladas"
                                                type="number"
                                                style={{ width: "120px" }}
                                                value={pesos.visitas_canceladas}
                                                onChange={(e) => setPesos({ ...pesos, visitas_canceladas: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Visitas que foram marcadas e que estão aguardando">
                                            <TextField
                                                disabled={!enabled}
                                                id="visitasAguardando"
                                                label="Visitas Aguardando"
                                                type="number"
                                                style={{ width: "120px" }}
                                                value={pesos.visitas_aguardando}
                                                onChange={(e) => setPesos({ ...pesos, visitas_aguardando: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Visitas que foram marcadas e que estão aguardando">
                                            <TextField
                                                disabled={!enabled}
                                                id="interessou"
                                                label="Interessou"
                                                type="number"
                                                style={{ width: "120px" }}
                                                value={pesos.interessou}
                                                onChange={(e) => setPesos({ ...pesos, interessou: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="interessouGerouProposta">
                                            <TextField
                                                disabled={!enabled}
                                                id="interessouGerouProposta"
                                                label="Interessou Gerou Proposta"
                                                type="number"
                                                style={{ width: "120px" }}
                                                value={pesos.interessou_gerou_proposta}
                                                onChange={(e) => setPesos({ ...pesos, interessou_gerou_proposta: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>


                            </div>
                            <div className="mx-3 flex flex-row mt-2">
                                <div className="flex flex-row justify-center gap-4 w-full">
                                    <div>
                                        <Tooltip title="Razão de entre Venda/M²">
                                            <TextField
                                                disabled={!enabled}
                                                id="vendaPorM2"
                                                label="Razão Venda/M²"
                                                type="number" style={{ width: "120px" }}
                                                value={pesos.venda_por_m2}
                                                onChange={(e) => setPesos({ ...pesos, venda_por_m2: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>

                                    <div>
                                        <Tooltip title="Razão de entre Aluguel/M²">
                                            <TextField
                                                disabled={!enabled}
                                                id="locacaoPorM2"
                                                label="Razão Locação/M²"
                                                type="number" style={{ width: "120px" }}
                                                value={pesos.locacao_por_m2}
                                                onChange={(e) => setPesos({ ...pesos, locacao_por_m2: e.target.value })}
                                            />
                                        </Tooltip>
                                        </div>

                                </div>
                            </div>

                        </div>

                        <div className=" border border-dotted border-amber-900 mt-4 rounded-md py-2">
                            <div div className="w-full mt-5">
                                <div className="flex flex-row gap-4 justify-center w-full">
                                    <div>
                                        <Tooltip title="Máximo de dias para considerar um imóvel novo">
                                            <TextField disabled={!enabled} id="max-dias-novo" label="Max.Novo" type="number" style={{ width: "180px" }}
                                                value={config.maxDiasNovo}
                                                onChange={(e) => setConfig({ ...config, maxDiasNovo: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Máximo de dias para considerar um imóvel atualizado">
                                            <TextField disabled={!enabled} id="max-dias-atualizado" label="Max.Atualizado" type="number" style={{ width: "180px" }}
                                                value={config.maxDiasAtualizado}
                                                onChange={(e) => setConfig({ ...config, maxDiasAtualizado: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-4 justify-center w-full mt-5">
                                    <div>
                                        <Tooltip title="Quantidade de Super Anúncios">
                                            <TextField disabled={!enabled} id="super-anuncios" label="Super Anúncios" type="number" style={{ width: "180px" }}
                                                value={config.superAnuncios}
                                                onChange={(e) => setConfig({ ...config, superAnuncios: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Quantidade de Anúncios Destacados">
                                            <TextField disabled={!enabled} id="destacados-anuncios" label="Anúncios Destacados" type="number" style={{ width: "180px" }}
                                                value={config.anunciosDestacados}
                                                onChange={(e) => setConfig({ ...config, anunciosDestacados: e.target.value })}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div>
                                        <Tooltip title="Quantidade Total de Anuncios">
                                            <TextField disabled={!enabled} id="total-anuncios" label="Total Anuncios" type="number" style={{ width: "180px" }}
                                                value={config.totalAnuncios}
                                                onChange={(e) => setConfig({ ...config, totalAnuncios: e.target.value })}
                                            />
                                        </Tooltip>



                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full justify-center mt-2">
                        <button onClick={(_) => onSetTela(0)} id="btn-criterios" className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">Voltar</button>
                    </div>
                    <div className="flex w-full justify-center mt-2">
                        <button
                            onClick={(_) => handleSave()}
                            id="btn-criterios"
                            className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">
                            {enabled ? "Salvar" : "Editar"}
                        </button>

                    </div>

                    <div className="flex w-full justify-center mt-2">
                        <button
                            onClick={(_) => onCalculate(pesos, config)}
                            id="btn-criterios"
                            className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10">
                            Calcular
                        </button>
                    </div>


                </div>

            </div>
            : <div>Configuração não carregada</div>
    );
}