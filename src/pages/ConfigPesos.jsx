import { Tooltip, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { writeFile, readTextFile } from "@tauri-apps/api/fs";
import React from "react";
import { NavigationContext } from "../NavigationContext";

export default function ConfigPesos({ onSetTela, onCalculate, hidden }) {

  const { setActiveScreen } = React.useContext(NavigationContext);
  const [enabled, setEnabled] = useState(false);
  const [pesos, setPesos] = useState({
    cont_tipo_dormitorio_bairro: 0,
    cont_tipo_dormitorio: 0,
    cont_tipo_bairro: 0,
    cont_bairro: 0,
    diminuiu_preco: 0,
    visualizacoes: 0,
    novo: 0,
    contatos: 0,
    visitas: 0,
    venda_por_m2: 0, // Adicionado valor inicial
    locacao_por_m2: 0, // Adicionado valor inicial
  });
  const [config, setConfig] = useState({
    maxDiasNovo: 0,
    maxDiasAtualizado: 0,
    superAnuncios: 0,
    anunciosDestacados: 0,
    anunciosPadroes: 0,
  });

  useEffect(() => {
    appLocalDataDir()
      .then((appDataDirectory) => {
        const path = `${appDataDirectory}\config.json`;
        readTextFile(path)
          .then((data) => {
            const json = JSON.parse(data);
            if (json.pesos) {
              setPesos(json.pesos);
            } else {
              setPesos({});
            }
            setConfig(json.config);
          })
          .catch((err) => {
            console.error("Erro ao ler arquivo", err);
            setPesos({
              cont_tipo_dormitorio_bairro: 0,
              cont_tipo_dormitorio: 0,
              cont_tipo_bairro: 0,
              cont_bairro: 0,
              diminuiu_preco: 0,
              visualizacoes: 0,
              novo: 0,
              contatos: 0,
              visitas: 0,
              venda_por_m2: 0,
              locacao_por_m2: 0,
            });
            setConfig({
              maxDiasNovo: 0,
              maxDiasAtualizado: 0,
              superAnuncios: 0,
              anunciosDestacados: 0,
              anunciosPadroes: 0,
            });
          })
          .catch((err) => {
            console.error("Erro ao obter diretório de dados", err);
          });
      })
      .catch((err) => {
        console.error("Erro ao obter diretório de dados", err);
      });
  }, []);

  const handleSave = async () => {
    setEnabled(!enabled);
    if (enabled) {
      const pesosAndConfig = {
        pesos: pesos,
        config: config,
      };
      // Agora esperamos que a Promise de appDataDir seja resolvida antes de construir o caminho
      const appDataDirectory = await appLocalDataDir();
      const path = appDataDirectory + "\\config.json";
      writeFile({
        path: path,
        contents: JSON.stringify(pesosAndConfig),
      })
        .then((_) => {
          console.log("Arquivo salvo com sucesso");
        })
        .catch((err) => {
          console.error("Erro ao salvar arquivo", err);
        });
    }
  };

  return (
    <div
      className={`flex-col p-3 w-full justify-center ${hidden ? "hidden" : ""}
      }`}
    >
      <div className="flex w-full justify-center">
        <img src="img/casa_alta.png" alt="Casa Alta Imoveis" width={"5%"} />
      </div>
      <div>
        <div className="flex w-full justify-center mt-3">
          <p className="text-md">
            Ajuste os pesos de cada critério para a avaliação dos imóveis
          </p>
        </div>

        <div className={`p-5`}>
          <div className="w-full py-10 border gap-3 border-amber-900 border-dashed flex flex-col justify-center rounded-md overflow-x-auto">
            <div className="mx-3 flex flex-row">
              <div className="flex flex-row justify-center gap-4 w-full">
                <div>
                  <Tooltip title="Imóveis do mesmo tipo no mesmo bairro">
                    <TextField
                      disabled={!enabled}
                      id="cont_tipo_bairro"
                      label="Bairro/Tipo"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.cont_tipo_bairro}
                      onChange={(e) =>
                        setPesos({ ...pesos, cont_tipo_bairro: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Imóveis do mesmo bairro">
                    <TextField
                      disabled={!enabled}
                      id="cont_bairro"
                      label="Bairro"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.cont_bairro}
                      onChange={(e) =>
                        setPesos({ ...pesos, cont_bairro: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>

                <div>
                  <Tooltip title="Imóveis do mesmo tipo de dormitório">
                    <TextField
                      disabled={!enabled}
                      id="cont_tipo_dormitorio"
                      label="Tipo Dormitório"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.cont_tipo_dormitorio}
                      onChange={(e) =>
                        setPesos({
                          ...pesos,
                          cont_tipo_dormitorio: e.target.value,
                        })
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            </div>

            <div className="mx-3 flex flex-row mt-5">
              <div className="flex flex-row justify-center gap-4 w-full">
                <div>
                  <Tooltip title="Imóveis do mesmo tipo de dormitórios, bairro e tipo">
                    <TextField
                      disabled={!enabled}
                      id="cont_tipo_dormitorio_bairro"
                      label="Tipo/Dormitório/Bairro"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.cont_tipo_dormitorio_bairro}
                      onChange={(e) =>
                        setPesos({
                          ...pesos,
                          cont_tipo_dormitorio_bairro: e.target.value,
                        })
                      }
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Imóveis que diminuiram o preço">
                    <TextField
                      disabled={!enabled}
                      id="diminuiu_preco"
                      label="Diminuiu Preço"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.diminuiu_preco}
                      onChange={(e) =>
                        setPesos({ ...pesos, diminuiu_preco: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>

                <div>
                  <Tooltip title="Quantidade de Visualizações">
                    <TextField
                      disabled={!enabled}
                      id="visualizacoes"
                      label="Visualizações"
                      type="number"
                      style={{ width: "120px" }}
                      value={pesos.visualizacoes}
                      onChange={(e) =>
                        setPesos({ ...pesos, visualizacoes: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>
              </div>

              <div></div>
            </div>
            <div className="mx-3 flex flex-row mt-5">
              <div className="flex flex-row justify-center gap-4 w-full">
                <Tooltip title="Imóveis Novos">
                  <TextField
                    disabled={!enabled}
                    id="novo"
                    label="Novo"
                    type="number"
                    style={{ width: "120px" }}
                    value={pesos.novo}
                    onChange={(e) =>
                      setPesos({ ...pesos, novo: e.target.value })
                    }
                  />
                </Tooltip>
                

                <Tooltip title="Quantidade de Contatos">
                  <TextField
                    disabled={!enabled}
                    id="contatos"
                    label="Contatos"
                    type="number"
                    style={{ width: "120px" }}
                    value={pesos.contatos}
                    onChange={(e) =>
                      setPesos({ ...pesos, contatos: e.target.value })
                    }
                  />
                </Tooltip>
              </div>
            </div>

            <div className="mx-3 flex flex-row mt-5">
              <div className="flex flex-row justify-center gap-4 w-full">
                <Tooltip title="Quantidade de Visitas">
                  <TextField
                    disabled={!enabled}
                    id="visitas"
                    label="Visitas"
                    type="number"
                    style={{ width: "120px" }}
                    value={pesos.visitas}
                    onChange={(e) =>
                      setPesos({ ...pesos, visitas: e.target.value })
                    }
                  />
                </Tooltip>
                <Tooltip title="Venda por m²">
                  <TextField
                    disabled={!enabled}
                    id="venda_por_m2"
                    label="Venda por m²"
                    type="number"
                    style={{ width: "120px" }}
                    value={pesos.venda_por_m2}
                    onChange={(e) =>
                      setPesos({ ...pesos, venda_por_m2: e.target.value })
                    }
                  />
                </Tooltip>
                <Tooltip title="Locação por m²">
                  <TextField
                    disabled={!enabled}
                    id="locacao_por_m2"
                    label="Locação por m²"
                    type="number"
                    style={{ width: "120px" }}
                    value={pesos.locacao_por_m2}
                    onChange={(e) =>
                      setPesos({ ...pesos, locacao_por_m2: e.target.value })
                    }
                  />
                </Tooltip>
              </div>
            </div>
          </div>

          <div className=" border border-dotted border-amber-900 mt-4 rounded-md py-2">
            <div className="w-full mt-5">
              <div className="flex flex-row gap-4 justify-center w-full">
                <div>
                  <Tooltip title="Máximo de dias para considerar um imóvel novo">
                    <TextField
                      disabled={!enabled}
                      id="max-dias-novo"
                      label="Max.Novo"
                      type="number"
                      style={{ width: "180px" }}
                      value={config.maxDiasNovo}
                      onChange={(e) =>
                        setConfig({ ...config, maxDiasNovo: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>
              </div>

              <div className="flex flex-row gap-4 justify-center w-full mt-5">
                <div>
                  <Tooltip title="Quantidade de Super Anúncios">
                    <TextField
                      disabled={!enabled}
                      id="super-anuncios"
                      label="Super Anúncios"
                      type="number"
                      style={{ width: "180px" }}
                      value={config.superAnuncios}
                      onChange={(e) =>
                        setConfig({ ...config, superAnuncios: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Quantidade de Anúncios Destacados">
                    <TextField
                      disabled={!enabled}
                      id="destacados-anuncios"
                      label="Anúncios Destacados"
                      type="number"
                      style={{ width: "180px" }}
                      value={config.anunciosDestacados}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          anunciosDestacados: e.target.value,
                        })
                      }
                    />
                  </Tooltip>
                </div>
                <div>
                  <Tooltip title="Quantidade Total de Anuncios">
                    <TextField
                      disabled={!enabled}
                      id="anuncios-padrao"
                      label="Anúncios Padrões"
                      type="number"
                      style={{ width: "180px" }}
                      value={config.anunciosPadroes}
                      onChange={(e) =>
                        setConfig({ ...config, anunciosPadroes: e.target.value })
                      }
                    />
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center mt-2">
          <button
            onClick={(_) => setActiveScreen("MainScreen")}
            id="btn-criterios"
            className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10"
          >
            Voltar
          </button>
        </div>
        <div className="flex w-full justify-center mt-2">
          <button
            onClick={(_) => handleSave()}
            id="btn-criterios"
            className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10"
          >
            {enabled ? "Salvar" : "Editar"}
          </button>
        </div>

        <div className="flex w-full justify-center mt-2">
          <button
            onClick={(_) => onCalculate(pesos, config)}
            id="btn-criterios"
            className="bg-amber-900 hover:bg-amber-800 text-white font-bold py-2 px-4 rounded w-full mx-10"
          >
            Calcular
          </button>
        </div>
      </div>
    </div>
  );
}

/*
TODO:   
        - Sugerir mundanças de tipos de anuncios
        - A planilha de resultado precisa estar mais limpa, o modelo vai ser enviado
        - retirar os criterios Ativo, atualizado, conservação, 
        - Um criterio a mais, que avaliara o tipo do imovel, considerando a quantidade de dormitórios
        - Totais de anuncios é apenas um campo calculado, e este critério passa a ser  os imoveis normais
        - Retirar todas as visitas, e deixar apenas visitas concluidas como critéiro
        - Mudar o nome do aplicativo, e a logo Casalta
        - Dashborad com a quantidade de movimentações de imóveis
        - Grafico indicando quantos imóveis cada captador tem
        - Resultados das planilhas precisam estar formatados




*/
