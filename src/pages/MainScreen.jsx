import { invoke } from "@tauri-apps/api";
import ButtonExcel from "../Components/ButtonExcel";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { NavigationContext } from "../NavigationContext";
import React from "react";

export default function MainScreen({onGetParams}) {
  const [fileImoveis, setFileImoveis] = useState("...");
  const [fileVisitas, setFileVisitas] = useState("...");
  const [fileAnuncios, setFileAnuncios] = useState("...");
  const [fileArquivoAntigo, setFileArquivoAntigo] = useState("...");
  const [dataImoveis, setDataImoveis] = useState([]);
  const [dataVisitas, setDataVisitas] = useState([]);
  const [dataAnuncios, setDataAnuncios] = useState([]);
  const [dataArquivoAntigo, setDataArquivoAntigo] = useState([]);
  const [processedData, setProcessedData] = useState({});
  


 


  const {setSharedState, setActiveScreen} = React.useContext(NavigationContext);

  useEffect(() => {
    if (
      dataImoveis.length > 0 &&
      dataVisitas.length > 0 &&
      dataAnuncios.length > 0 
    ) {
      const compiledData = compileData(
        dataImoveis,
        dataVisitas,
        dataAnuncios,

      );

      invoke("compila_dados", { data: JSON.stringify(compiledData) }).then(
        (response) => {
          setProcessedData({
            estatisticas: response,
            compiledData: compiledData,

          })
        }
      );

    }
  }, [dataImoveis, dataVisitas, dataAnuncios]);


  return (
    <div className="p-20">
      <div className="flex justify-around gap-8">
        <ButtonExcel
          withArchive={fileImoveis !== "..." ? true : false}
          description={"Imóveis"}
          fileName={fileImoveis}
          id={"Imoveis"}
          onSendData={setDataImoveis}
          onSendFileName={setFileImoveis}
        />
        <ButtonExcel
          withArchive={fileVisitas !== "..." ? true : false}
          description={"Visitas"}
          fileName={fileVisitas}
          id={"Visitas"}
          onSendFileName={setFileVisitas}
          onSendData={setDataVisitas}
        />
        <ButtonExcel
          withArchive={fileAnuncios !== "..." ? true : false}
          description={"Anúncios"}
          fileName={fileAnuncios}
          id={"Anúncios"}
          onSendFileName={setFileAnuncios}
          onSendData={setDataAnuncios}
        />
        <ButtonExcel
          withArchive={fileArquivoAntigo !== "..." ? true : false}
          description={"Arquivo Antigo"}
          fileName={fileArquivoAntigo}
          id={"Ranking"}
          onSendFileName={setFileArquivoAntigo}
          onSendData={setDataArquivoAntigo}
        />
      </div>

      <div className="py-10 w-full">

        <Button

        fullWidth
        variant="contained"
        color="primary"

        onClick={() => {
          setSharedState({dataArquivoAntigo, processedData});
          setActiveScreen("DashBoard");
        }}
        >

          Estatísticas
        </Button>
      </div>
    </div>
  );
}

function compileData(dataImoveis, dataVisitas, dataAnuncios) {
  let result = [];
  dataImoveis.forEach((item) => {
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
      vendaPorM2: item.r_venda / item.area,
      locacaoPorM2: item.r_locacao / item.area,
      tipoDoAnuncio: "",
      dormitorios: item.dormitorios,
      finalidade: item.finalidade,
      endereco: item.endereco,
    };
    let anunc = dataAnuncios.filter((item) => {
      return item.codigo_do_imovel === reg.referencia;
    });

    if (anunc.length > 0) {
      reg.tipoDoAnuncio = anunc[0].tipo_do_anuncio;
      reg.visualizacoes = anunc[0].total_de_visualizacoes;
      reg.contatos = anunc[0].total_de_contatos;
    } else {
      reg.visualizacoes = 0;
      reg.contatos = 0;
    }

    let visitas = dataVisitas.filter((item) => {
      return item.ref_imovel == reg.referencia;
    });
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
        if (
          !isNaN(
            parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__conservacao)
          )
        ) {
          reg.totalConservacao +=
            vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__conservacao;
        }
        if (
          !isNaN(
            parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__localizacao)
          )
        ) {
          reg.totalLocalizacao +=
            vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__localizacao;
        }

        if (
          isNaN(parseInt(vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__valor))
        ) {
          reg.totalAvaliacao +=
            vis.avaliacao_do_imovel_pelo_cliente_de_1_a_5__valor;
        }
      });
    }
    if (reg.visitasConcluidas > 0) {
      reg.mediaConsevacao = reg.totalConservacao / reg.visitasConcluidas;
    } else {
      reg.mediaConsevacao = 0;
    }

    if (reg.visitasConcluidas > 0) {
      reg.mediaLocalizacao = reg.totalLocalizacao / reg.visitasConcluidas;
    } else {
      reg.mediaLocalizacao = 0;
    }
    if (reg.visitasConcluidas > 0) {
      reg.mediaAvaliacao = reg.totalAvaliacao / reg.visitasConcluidas;
    } else {
      reg.mediaAvaliacao = 0;
    }
    reg.avaliacaoSubjetiva = 0;

    result.push(reg);
  });
  return result;
}
