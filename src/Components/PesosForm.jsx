import React from 'react';
import { Card, TextField, Tooltip } from '@mui/material';

export default function PesosForm ({ pesos, setPesos, config, setConfig, disabled }) {
  return (
    <div className="p-5 flex flex-col gap-3 justify-center">
      <Card className="p-5">
        <div className="flex flex-row gap-1 justify-center pb-2">
          <Tooltip title="Critério que considera a quantidade de imóveis de um tipo em um bairro com um número específico de dormitórios">
            <TextField
              disabled={disabled}
              label="Tipo/Bairro/Dormitorio"
              variant="outlined"
              type="number"
              value={pesos.cont_tipo_bairro_dormitorio}
              onChange={(e) => {
                setPesos({
                  ...pesos,
                  cont_tipo_bairro_dormitorio: e.target.value,
                });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera a quantidade de imóveis de um tipo em um bairro">
            <TextField
               disabled={disabled}
              label="Tipo/Bairro"
              variant="outlined"
              type="number"
              value={pesos.cont_tipo_bairro}
              onChange={(e) => {
                setPesos({ ...pesos, cont_tipo_bairro: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera a quantidade de imóveis em um mesmo bairro">
            <TextField
               disabled={disabled}
              label="Bairro"
              variant="outlined"
              type="number"
              value={pesos.cont_bairro}
              onChange={(e) => {
                setPesos({ ...pesos, cont_bairro: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera a quantidade de imóveis de um tipo">
            <TextField
               disabled={disabled}
              label="Tipo"
              variant="outlined"
              type="number"
              value={pesos.cont_tipo}
              onChange={(e) => {
                setPesos({ ...pesos, cont_tipo: e.target.value });
              }}
            />
          </Tooltip>
          <Tooltip title="Critério que considera a quantidade de imóveis de um tipo com um número específico de dormitórios">
            <TextField
               disabled={disabled}
              label="Tipo/Dormitorio"
              variant="outlined"
              type="number"
              value={pesos.cont_tipo_dormitorio}
              onChange={(e) => {
                setPesos({ ...pesos, cont_tipo_dormitorio: e.target.value });
              }}
            />
          </Tooltip>
        </div>
        <div className="flex flex-row gap-1 justify-center pb-2">
          <Tooltip title="Critério que considera a quantidade de imóveis de um tipo em um bairro com um número específico de dormitórios">
            <TextField
               disabled={disabled}
              label="Dormitorio/Bairro"
              variant="outlined"
              type="number"
              value={pesos.cont_dormitorio_bairro}
              onChange={(e) => {
                setPesos({
                  ...pesos,
                  cont_dormitorio_bairro: e.target.value,
                });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera imóveis que diminuiram de preço">
            <TextField
               disabled={disabled}
              label="Diminuiu Preço"
              variant="outlined"
              type="number"
              value={pesos.diminuiu_preco}
              onChange={(e) => {
                setPesos({ ...pesos, diminuiu_preco: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera a quantidade de visualizações">
            <TextField
               disabled={disabled}
              label="Visualizações"
              variant="outlined"
              type="number"
              value={pesos.visualizacoes}
              onChange={(e) => {
                setPesos({ ...pesos, visualizacoes: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera a quantidade de imóveis novos">
            <TextField
               disabled={disabled}
              label="Novo"
              variant="outlined"
              type="number"
              value={pesos.novo}
              onChange={(e) => {
                setPesos({ ...pesos, novo: e.target.value });
              }}
            />
          </Tooltip>
          <Tooltip title="Critério que considera a quantidade de contatos">
            <TextField
               disabled={disabled}
              label="Contatos"
              variant="outlined"
              type="number"
              value={pesos.contatos}
              onChange={(e) => {
                setPesos({ ...pesos, contatos: e.target.value });
              }}
            />
          </Tooltip>
        </div>

        <div className="flex flex-row gap-1 justify-center pb-2">
          <Tooltip title="Critério que considera a quantidade de visitas">
            <TextField
               disabled={disabled}
              label="Visitas"
              variant="outlined"
              type="number"
              value={pesos.visitas}
              onChange={(e) => {
                setPesos({ ...pesos, visitas: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera o preço de venda por m2">
            <TextField
               disabled={disabled}
              label="Venda/m2"
              variant="outlined"
              type="number"
              value={pesos.venda_por_m2}
              onChange={(e) => {
                setPesos({ ...pesos, venda_por_m2: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Critério que considera o preço de locação por m2">
            <TextField
               disabled={disabled}
              label="Locação/m2"
              variant="outlined"
              type="number"
              value={pesos.locacao_por_m2}
              onChange={(e) => {
                setPesos({ ...pesos, locacao_por_m2: e.target.value });
              }}
            />
          </Tooltip>
        </div>
      </Card>
      <Card className="p-5">
        <div className="flex flex-row gap-1 justify-center pb-2">
          <Tooltip title="Quantidade máxima de dias que um imóvel é considerado novo">
            <TextField
               disabled={disabled}
              label="Dias / Novo"
              variant="outlined"
              type="number"
              value={config.maxDiasNovo}
              onChange={(e) => {
                setConfig({ ...config, maxDiasNovo: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Quantidade máxima de dias que um imóvel é considerado atualizado">
            <TextField
               disabled={disabled}
              label="Dias / Atualizado"
              variant="outlined"
              type="number"
              value={config.maxDiasAtualizado}
              onChange={(e) => {
                setConfig({ ...config, maxDiasAtualizado: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Quantidade de anúncios super destacados">
            <TextField
               disabled={disabled}
              label="Super Anúncios"
              variant="outlined"
              type="number"
              value={config.superAnuncios}
              onChange={(e) => {
                setConfig({ ...config, superAnuncios: e.target.value });
              }}
            />
          </Tooltip>

          <Tooltip title="Quantidade de anúncios destacados">
            <TextField
               disabled={disabled}
              label="Anúncios Destacados"
              variant="outlined"
              type="number"
              value={config.anunciosDestacados}
              onChange={(e) => {
                setConfig({ ...config, anunciosDestacados: e.target.value });
              }}
            />
          </Tooltip>

         
          <Tooltip title="Quantidade de anúncios padrões">
            <TextField
               disabled={disabled}
              label="Anúncios Padrões"
              variant="outlined"
              type="number"
              value={config.anunciosPadroes}
              onChange={(e) => {
                setConfig({ ...config, anunciosPadroes: e.target.value });
              }}
            />
          </Tooltip>
        </div>
      </Card>
    </div>
  );
};

