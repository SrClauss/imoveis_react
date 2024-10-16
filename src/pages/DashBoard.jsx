import React, { useContext, useEffect, useState } from "react";
import { NavigationContext } from "../NavigationContext";
import { PieChart } from "@mui/x-charts";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, TextField, Tooltip } from "@mui/material";
import { dialog, fs } from "@tauri-apps/api";
import { appLocalDataDir, localDataDir } from "@tauri-apps/api/path";
import { ExpandMore } from "@mui/icons-material";
import PesosForm from "../Components/PesosForm";

const WIDTH = 600;
const HEIGTH = 200;
export default function DashBoard() {
  const { sharedState, setActiveScreen } = useContext(NavigationContext);
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

  const [saveDisabled, setSaveDisabled] = useState(true);
  const handleSaveConfig = () => {
    appLocalDataDir().then((dir) => {
      fs.writeTextFile(`${dir}config.json`, JSON.stringify({ pesos, config })).then(() => {
        dialog.message("Configurações salvas com sucesso", {title: "Sucesso"});
        setSaveDisabled(true);
      }).catch((err) => {

        dialog.message({title: "Erro", message: err.message

        });

      });
    }).catch((err) => {
      dialog.message({title: "Erro", message: err.message});
    })
    ;
  };
  const handleEditConfig = () => {

    setSaveDisabled(false);
  };


  


  useEffect(() => {
    appLocalDataDir().then((dir) => {
      fs.readTextFile(`${dir}config.json`).then((config) => {
        setPesos(JSON.parse(config).pesos);
        setConfig(JSON.parse(config).config);
      });
    });
  }, []);

  return (
    <div>
      <h1 className="text-center text-3xl p-5">Configurar Pesos</h1>
      <div className="m-5">

      <Accordion  defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMore/>}>
          <h2 className="text-center text-2xl">
            Análise de Nichos de Mercado
          </h2>
        </AccordionSummary>
        <AccordionDetails>
        <div className="p-5">

        <div className="flex flex-row justify-center">
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBairros(
                    sharedState.processedData["estatisticas"][0]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[0],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",

                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <div className="w-full text-center text-xl pb-3">Bairros/Tipo</div>
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBairros(
                    sharedState.processedData["estatisticas"][1]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[1],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
        </div>
        <div className="flex flex-row justify-center">
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <div className="w-full text-center text-xl pb-3">
              Dormitórios/Bairros
            </div>
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBarras(
                    sharedState.processedData["estatisticas"][2]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[2],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <div className="w-full text-center text-xl pb-3">
              Tipo/bairro/dormitórios
            </div>
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBarras(
                    sharedState.processedData["estatisticas"][3]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[3],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
        </div>
        <div className="flex flex-row justify-center">
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <div className="w-full text-center text-xl pb-3">Tipos</div>
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBarras(
                    sharedState.processedData["estatisticas"][4]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[4],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
          <Card
            sx={{ width: WIDTH - 100 }}
            className="flex m-5 justify-start flex-col"
          >
            <div className="w-full text-center text-xl pb-3">
              Tipo/Dormitório
            </div>
            <PieChart
              sx={{ marginLeft: "-300px" }}
              colors={[
                "#80B3FF",
                "#66CCCC",
                "#FFFF99",
                "#FFD580",
                "#FFB366",
                "#CC6666",
              ]}
              series={[
                {
                  data: plotBarras(
                    sharedState.processedData["estatisticas"][5]
                  ),
                  arcLabel: (item) =>
                    `${percentilOfObject(
                      sharedState.processedData.estatisticas[5],
                      item.value
                    )}%`,
                  color: (item) => item.color,
                  arcLabelMinAngle: 35,
                  arcLabelRadius: "60%",
                  innerRadius: 30,
                  outerRadius: 90,
                },
              ]}
              width={WIDTH}
              height={HEIGTH}
            />
          </Card>
        </div>
        </div>
        </AccordionDetails>
      </Accordion>
      
      </div>
      <PesosForm pesos={pesos} setPesos={setPesos} config={config} setConfig={setConfig} disabled={saveDisabled} />

      <Card className="flex flex-col p-5 m-5 gap-2">
        <div>
          <Button fullWidth variant="contained" onClick={saveDisabled? handleEditConfig: handleSaveConfig }>
            {

              saveDisabled ? "Editar Configurações" : "Salvar Configurações"
            }
          </Button>
        </div>
        <div>
          <Button fullWidth variant="contained" onClick={() => setActiveScreen("MainScreen")}>Voltar</Button>

        </div>

        <div>
          <Button fullWidth variant="contained" onClick={() => setActiveScreen("TabelaDinamica")}>Tabela Dinâmica</Button>
        </div>
        
        
      </Card>
    </div>
  );
}

function plotBairros(bairros) {
  let values = Object.keys(bairros).map((bairro, index) => {
    return {
      id: index,
      value: bairros[bairro],
      label: bairro.replace("_", "/"),
    };
  });

  //ordena os maiores values

  values.sort((a, b) => {
    return b.value - a.value;
  });

  //soma os menores valores abaixo de sexta posição
  let others = 0;
  for (let i = 5; i < values.length; i++) {
    others += values[i].value;
  }
  //reorganiza values para que tenha os 6 maiores valores e o restante seja agrupado em "outros"

  values = values.slice(0, 5);
  values.push({ id: 6, value: others, label: "Outros" });

  return values;
}

function plotBarras(data) {
  let array_obj = Object.keys(data).map((key) => {
    return { name: key, value: data[key] };
  });
  array_obj.sort((a, b) => {
    return b.value - a.value;
  });
  //pegue os seis maiores valores de arrayobj e some os demais em outres

  let others = 0;
  for (let i = 5; i < array_obj.length; i++) {
    others += array_obj[i].value;
  }
  array_obj = array_obj.slice(0, 5);
  array_obj.push({ name: "Outros", value: others });
  return array_obj.map((item, index) => {
    return {
      id: index,
      value: item.value,
      label: item.name.replaceAll("_", "/"),
    };
  });
}
function percentilOfObject(obj, value) {
  const sum = Object.values(obj).reduce((a, b) => a + b, 0);
  return ((value / sum) * 100).toFixed(1);
}
