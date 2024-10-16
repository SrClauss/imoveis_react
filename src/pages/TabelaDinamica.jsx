import { useContext, useEffect, useState } from "react";
import { NavigationContext } from "../NavigationContext";
import PesosForm from "../Components/PesosForm";
import {
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { appLocalDataDir } from "@tauri-apps/api/path";
import { fs, invoke, dialog } from "@tauri-apps/api";
import { DataGrid } from "@mui/x-data-grid";

export default function TabelaDinamica() {
  const { sharedState, setActiveScreen } = useContext(NavigationContext);
  const [compiledData, setCompiledData] = useState(
    sharedState.processedData.compiledData
  );
  const [ranking, setRanking] = useState([]);
  const [pesos, setPesos] = useState({
    cont_tipo_bairro_dormitorio: "",
    cont_tipo_bairro: "",
    cont_bairro: "",
    cont_tipo: "",
    cont_tipo_dormitorio: "",
    cont_dormitorio_bairro: "",
    diminuiu_preco: "",
    visualizacoes: "",
    novo: "",
    contatos: "",
    visitas: "",
    venda_por_m2: "",
    locacao_por_m2: "",
  });
  const [config, setConfig] = useState({
    maxDiasNovo: "",
    maxDiasAtualizado: "",
    superAnuncios: "",
    anunciosDestacados: "",

    anunciosPadroes: "",
  });
  const [incluirTodosNovos, setIncluirTodosNovos] = useState(true);
  const [saveDisabled, setSaveDisabled] = useState(true);
  const [listaParaAnunciar, setListaParaAnunciar] = useState([]);
  const handleSaveConfig = () => {
    appLocalDataDir()
      .then((dir) => {
        fs.writeTextFile(`${dir}config.json`, JSON.stringify({ pesos, config }))
          .then(() => {
            dialog.message("Configurações salvas com sucesso", {
              title: "Sucesso",
            });
            setSaveDisabled(true);
          })
          .catch((err) => {
            dialog.message({ title: "Erro", message: err.message });
          });
      })
      .catch((err) => {
        dialog.message({ title: "Erro", message: err.message });
      });
  };
  const handleEditConfig = () => {
    setSaveDisabled(false);
  };

   const handleGerarPlanilha = () => {
    dialog.save(
      {
        filters: [{ name: "Planilha Excel", extensions: ["xlsx", "xls"] }]
      }

    ).then((filePath) => {
      if (filePath) {
        const excelFilePath = `${filePath}`;
      invoke("save_xlsx_ranking", {data: JSON.stringify(listaParaAnunciar), path: excelFilePath}).then((response)=>{

        console.log(listaParaAnunciar)
      }).catch((error)=>{

        console.log(error)
      })
        
      }
    });
  };
  useEffect(() => {
    appLocalDataDir().then((dir) => {
      fs.readTextFile(`${dir}/config.json`).then((data) => {
        setPesos(JSON.parse(data).pesos);
        setConfig(JSON.parse(data).config);
      });
    });
  }, []);

  useEffect(() => {
    invoke("classify", {
      data: JSON.stringify(compiledData),
      peso: JSON.stringify(pesos),
      oldData: JSON.stringify(sharedState.dataArquivoAntigo),
    })
      .then((response) => {
        let responseWithId = JSON.parse(response).map((item, index) => {
          if (item.tipoDoAnuncio === "") {
            item.tipoDoAnuncio = "Não Anunciado";
          }
          return { id: index + 1,  ...item };
        });

        setRanking(responseWithId);
        setListaParaAnunciar(
          geraListaParaAnunciar(
            responseWithId,
            parseInt(config.superAnuncios),
            parseInt(config.anunciosDestacados),
            parseInt(config.anunciosPadroes),
            incluirTodosNovos
          )
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, [compiledData, pesos]);

  const realFormatter = Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });

  const columns = [
    { field: "id", headerName: "Pos", width: 50 },
    { field: "referencia", headerName: "Referência", width: 100 },
    { field: "tipo", headerName: "Tipo", width: 100 },
    { field: "bairro", headerName: "Bairro", width: 150 },
    { field: "dormitorios", headerName: "Dormitórios", width: 100 },
    { field: "finalidade", headerName: "Finalidade", width: 100 },
    { field: "tipoDoAnuncio", headerName: "Tipo/Anúncio", width: 100 },
    { field: "endereco", headerName: "Endereço", width: 200 },
    {
      field: "venda",
      headerName: "Venda",
      width: 150,
      valueFormatter: (params) => realFormatter.format(params),
    },
    {
      field: "locacao",
      headerName: "Locação",
      width: 100,
      valueFormatter: (params) => realFormatter.format(params),
    },
    { field: "novo", headerName: "Novo", width: 100 },
    { field: "resultado", headerName: "Resultado", width: 200 },
  ];

  return (
    <div>
      <div className="flex flex-col w-full items-center">
        <Card className="w-fit-content">
          <PesosForm
            pesos={pesos}
            setPesos={setPesos}
            config={config}
            setConfig={setConfig}
            disabled={saveDisabled}
          />

          <div className="pr-5 pl-3 pb-6">
            <Button
              fullWidth
              variant="contained"
              onClick={saveDisabled ? handleEditConfig : handleSaveConfig}
            >
              {saveDisabled ? "Editar Configurações" : "Salvar Configurações"}
            </Button>
          </div>
          <div className="pr-5 pl-3 pb-6">
            <Button 
            fullWidth 
            
            variant="contained"
            onClick={handleGerarPlanilha}
            
            
            >
              Gerar Planilha
            </Button>
          </div>
          <div className="pr-5 pl-3 pb-6">
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={incluirTodosNovos}
                    onChange={(e) => setIncluirTodosNovos(e.target.checked)}
                  />
                }
                label="Incluir Todos Novos"
              />
            </FormControl>
          </div>
        </Card>

        <Card
          sx={{ width: "1360px", display: "flex", justifyContent: "center" }}
          className="mt-10"
        >
          <DataGrid
            disableColumnSorting={true}
            rows={ranking}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            sortModel={[
              {
                field: "resultado",
                sort: "desc",
              },
            ]}
            pageSizeOptions={[10, 20, 50]}
          />
        </Card>
      </div>
    </div>
  );
}
function geraListaParaAnunciar(
  ranking,
  numeroSuperAnuncios,
  numeroAnunciosDestacados,
  numeroAnunciosPadrao,
  incluirNovos
) {
  if (incluirNovos) {
    return geraListaIncluindoNovos(
      ranking,
      numeroSuperAnuncios,
      numeroAnunciosDestacados,
      numeroAnunciosPadrao
    );
  } else {
    return gerarLista(
      ranking,
      numeroSuperAnuncios,
      numeroAnunciosDestacados,
      numeroAnunciosPadrao
    );
  }
 
}



function geraListaIncluindoNovos(
  ranking,
  numeroSuperAnuncios,
  numeroAnunciosDestacados,
  numeroAnunciosPadrao
) {
  let listaParaAnunciar = [];
  const numeroAnuncios = numeroSuperAnuncios + numeroAnunciosDestacados + numeroAnunciosPadrao;

  // Adiciona os super anúncios
  for (let i = 0; i < numeroSuperAnuncios; i++) {
    const valorAInserir = {
      ranking: ranking[i].id,
      referencia: ranking[i].referencia,
      tipo: ranking[i].tipo,
      bairro: ranking[i].bairro,
      dormitorios: ranking[i].dormitorios,
      finalidade: ranking[i].finalidade,
      tipoDoAnuncio: "Super Anúncio",
      endereco: ranking[i].endereco,
      venda: ranking[i].venda,
      locacao: ranking[i].locacao,
      novo: ranking[i].novo,
      resultado: ranking[i].resultado,



    };
    listaParaAnunciar.push(valorAInserir);
  }

  // Adiciona os anúncios destacados
  for (let i = numeroSuperAnuncios; i < numeroSuperAnuncios + numeroAnunciosDestacados; i++) {
    const valorAInserir = {
      ranking: ranking[i].id,
      referencia: ranking[i].referencia,
      tipo: ranking[i].tipo,
      bairro: ranking[i].bairro,
      dormitorios: ranking[i].dormitorios,
      finalidade: ranking[i].finalidade,
      tipoDoAnuncio: "Anúncio Destacado",
      endereco: ranking[i].endereco,
      venda: ranking[i].venda,
      locacao: ranking[i].locacao,
      novo: ranking[i].novo,
      resultado: ranking[i].resultado
    };
    listaParaAnunciar.push(valorAInserir);
  }

  // Pega o resto da lista que não foi inserida
  const restoDaLista = ranking.slice(numeroSuperAnuncios + numeroAnunciosDestacados);

  // Adiciona os anúncios padrão
  let novos = restoDaLista.filter((anuncio) => anuncio.novo === true);
  let naoNovos = restoDaLista.filter((anuncio) => anuncio.novo === false);
  
  let i = 0;
  while (listaParaAnunciar.length < numeroAnuncios && i < novos.length) {
    const valorAInserir = { 
      ranking : novos[i].id,
      referencia: novos[i].referencia,
      tipo: novos[i].tipo,
      bairro: novos[i].bairro,
      dormitorios: novos[i].dormitorios,
      finalidade: novos[i].finalidade,
      tipoDoAnuncio: "Anúncio Padrão",
      endereco: novos[i].endereco,
      venda: novos[i].venda,
      locacao: novos[i].locacao,
      novo: novos[i].novo,
      resultado: novos[i].resultado
     };
    listaParaAnunciar.push(valorAInserir);
    i++;
  }

  const remanescente = numeroAnuncios - listaParaAnunciar.length;

  for (let i = 0; i < remanescente && i < naoNovos.length; i++) {
    const valorAInserir = {
      ranking: naoNovos[i].id,
      referencia: naoNovos[i].referencia,
      tipo: naoNovos[i].tipo,
      bairro: naoNovos[i].bairro,
      dormitorios: naoNovos[i].dormitorios,
      finalidade: naoNovos[i].finalidade,
      tipoDoAnuncio: "Anúncio Padrão",
      endereco: naoNovos[i].endereco,
      venda: naoNovos[i].venda,
      locacao: naoNovos[i].locacao,
      novo: naoNovos[i].novo,
      resultado: naoNovos[i].resultado
    };
    listaParaAnunciar.push(valorAInserir);
  }
    

  return listaParaAnunciar;
}


function gerarLista(
  ranking,
  numeroSuperAnuncios,
  numeroAnunciosDestacados,
  numeroAnunciosPadrao
) {
  let listaParaAnunciar = [];
  const numeroAnuncios = numeroSuperAnuncios + numeroAnunciosDestacados + numeroAnunciosPadrao;
 
  // Adiciona os super anúncios
  for (let i = 0; i < numeroSuperAnuncios; i++) {
    const valorAInserir = {
      ranking: ranking[i].id,
      referencia: ranking[i].referencia,
      tipo: ranking[i].tipo,
      bairro: ranking[i].bairro,
      dormitorios: ranking[i].dormitorios,
      finalidade: ranking[i].finalidade,
      tipoDoAnuncio: "Super Anúncio",
      endereco: ranking[i].endereco,
      venda: ranking[i].venda,
      locacao: ranking[i].locacao,
      novo: ranking[i].novo,
      resultado: ranking[i].resultado,

    }
    listaParaAnunciar.push(valorAInserir);
  }

  // Adiciona os anúncios destacados
  for (let i = numeroSuperAnuncios; i < numeroSuperAnuncios + numeroAnunciosDestacados; i++) {
    const valorAInserir = {
      ranking: ranking[i].id,
      referencia: ranking[i].referencia,
      tipo: ranking[i].tipo,
      bairro: ranking[i].bairro,
      dormitorios: ranking[i].dormitorios,
      finalidade: ranking[i].finalidade,
      tipoDoAnuncio: "Anúncio Destacado",
      endereco: ranking[i].endereco,
      venda: ranking[i].venda,
      locacao: ranking[i].locacao,
      novo: ranking[i].novo,
      resultado: ranking[i].resultado,
    }
    listaParaAnunciar.push(valorAInserir);
  }


  // Pega o resto da lista que não foi inserida

  const restoDaLista = ranking.slice(numeroSuperAnuncios + numeroAnunciosDestacados);

  // Adiciona os anúncios padrão
  for (let i = 0; i < numeroAnunciosPadrao; i++) {
    const valorAInserir = {
      ranking: restoDaLista[i].id,
      referencia: restoDaLista[i].referencia,
      tipo: restoDaLista[i].tipo,
      bairro: restoDaLista[i].bairro,
      dormitorios: restoDaLista[i].dormitorios,
      finalidade: restoDaLista[i].finalidade,
      tipoDoAnuncio: "Anúncio Padrão",
      endereco: restoDaLista[i].endereco,
      venda: restoDaLista[i].venda,
      locacao: restoDaLista[i].locacao,
      novo: restoDaLista[i].novo,
      resultado: restoDaLista[i].resultado,
    }
    listaParaAnunciar.push(valorAInserir);
  }

//Finalidade	Venda	Tipo do anuncio	Novo	Ranking	Resultado	Tipo	Id	Dormitorios	Endereco	Locacao	Referencia	Bairro


  return listaParaAnunciar;

}