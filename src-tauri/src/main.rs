// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod xlsx;
use chrono::NaiveDate;
use mouse_rs::Mouse;
use serde_json::Value;
use std::{collections::{HashMap, HashSet}, hash::Hash};
use tauri::{api::path::app_local_data_dir, utils::config};
use xlsx::xlsx::{
    get_sheets_names, read_excel_to_hash_vector, read_sheet_to_hash_vector, save_xlsx,
};
#[derive(Debug)]
struct Peso {
    cont_tipo_bairro_dormitorio: f32,
    cont_tipo_bairro: f32,
    cont_bairro: f32,
    cont_dormitorio_bairro: f32,
    diminuiu_preco: f32,
    visualizacoes: f32,
    novo: f32,
    contatos: f32,
    visitas: f32,
    venda_por_m2: f32,
    locacao_por_m2: f32,
}
impl Peso {
    fn new_from_strignify(json_str: String) -> Self {
        let json: Value = serde_json::from_str(json_str.as_str()).unwrap();
        fn parse_f32(value: &Value) -> f32 {
            value
                .as_str()
                .and_then(|s| s.parse::<f32>().ok())
                .unwrap_or(0.0)
        }

        Peso {

            cont_tipo_bairro_dormitorio: parse_f32(&json["cont_tipo_bairro_dormitorio"]),
            cont_dormitorio_bairro: parse_f32(&json["cont_tipo_dormitorio"]),
            cont_tipo_bairro: parse_f32(&json["cont_tipo_bairro"]),
            cont_bairro: parse_f32(&json["cont_bairro"]),
            diminuiu_preco: parse_f32(&json["diminuiu_preco"]),
            visualizacoes: parse_f32(&json["visualizacoes"]),
            novo: parse_f32(&json["novo"]),
            contatos: parse_f32(&json["contatos"]),
            visitas: parse_f32(&json["visitas"]),
            venda_por_m2: parse_f32(&json["venda_por_m2"]),
            locacao_por_m2: parse_f32(&json["locacao_por_m2"]),
        }
    }
}


fn get_criterio_bairro(data: &Vec<HashMap<String, Value>>) -> HashMap<String, f32> {
    //crie um hashmap para armazenar o critério de bairro
    let mut criterio_bairro = HashMap::new();
    //crie um set para armazenar os bairros
    let mut bairros = std::collections::HashSet::new();
    //iterar sobre os dados
    for item in data {
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();
        bairros.insert(bairro);
    }
    //insira cada elemento do set no hashmap com o valor 0
    for bairro in bairros {
        criterio_bairro.insert(bairro.to_string(), 0.0);
    }
    //iterar sobre os dados
    for item in data {
        //para cada item, incremente o valor do bairro correspondente
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();

        let contador = criterio_bairro.get_mut(bairro).unwrap();
        *contador += 1.0;
    }

    return criterio_bairro;
}
fn get_criterio_bairro_tipo_imovel(data: &Vec<HashMap<String, Value>>) -> HashMap<String, f32> {
    let mut criterio_bairro_tipo_imovel = HashMap::new();
    let mut bairros_tipo: HashSet<String> = std::collections::HashSet::new();

    for item in data {
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();
        let tipo = item.get("tipo");
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap().as_str();
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap();
        let bairro_tipo = format!("{}_{}", tipo, bairro);
        bairros_tipo.insert(bairro_tipo);
    }
    //insira cada elemento do set no hashmap com o valor 0
    for bairro_tipo in bairros_tipo {
        criterio_bairro_tipo_imovel.insert(bairro_tipo.to_string(), 0.0);
    }
    //iterar sobre os dados
    for item in data {
        //para cada item, incremente o valor do bairro correspondente
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();
        let tipo = item.get("tipo");
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap().as_str();
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap();
        let bairro_tipo = format!("{}_{}", tipo, bairro);
        let contador = criterio_bairro_tipo_imovel.get_mut(&bairro_tipo).unwrap();
        *contador += 1.0;
    }
    return criterio_bairro_tipo_imovel;
}
fn get_criterio_dormitorio_bairro(data: &Vec<HashMap<String, Value>>) -> HashMap<String, f32>{
    let mut criterio_bairro_dormitorios: HashMap<String, f32> = HashMap::new();
    let mut bairros_dormitorios: HashSet<String> = std::collections::HashSet::new();
    for item in data{

        let bairro = item.get("bairro");
        if bairro.is_none(){
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none(){
            continue;
        }
        let bairro = bairro.unwrap();
        let dormitorios = item.get("dormitorios");
        if dormitorios.is_none(){
            continue;
        }
        let dormitorios = dormitorios.unwrap().as_f64().unwrap() as i32;
        let bairro_dormitorios = format!("{}_{}", dormitorios, bairro);
        bairros_dormitorios.insert(bairro_dormitorios);


    }
    for bairro_dormitorio in bairros_dormitorios{
        criterio_bairro_dormitorios.insert(bairro_dormitorio.to_string(), 0.0);
    }

    
    for item in data{
        let bairro = item.get("bairro");
        if bairro.is_none(){
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none(){
            continue;
        }
        let bairro = bairro.unwrap();
        let dormitorios = item.get("dormitorios");
        if dormitorios.is_none(){
            continue;
        }
        let dormitorios = dormitorios.unwrap().as_f64().unwrap() as i32;
        let bairro_dormitorios = format!("{}_{}", dormitorios, bairro);
        let contador = criterio_bairro_dormitorios.get_mut(&bairro_dormitorios).unwrap();
        *contador += 1.0;
    }
 
    return criterio_bairro_dormitorios;


}
fn get_criterio_tipo_bairro_dormitorio(data: &Vec<HashMap<String, Value>>) -> HashMap<String, f32> {
    let mut criterio_tipo_bairro_dormitorio = HashMap::new();
    let mut tipos_bairro_dormitorios: HashSet<String> = std::collections::HashSet::new();
    for item in data {
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();
        let dormitorios = item.get("dormitorios");
        if dormitorios.is_none() {
            continue;
        }
        let dormitorios = dormitorios.unwrap().as_f64().unwrap() as i32;
        let tipo = item.get("tipo");
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap().as_str();
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap();
        let tipo_bairro_dormitorios = format!("{}_{}_{}", tipo, bairro, dormitorios);
        tipos_bairro_dormitorios.insert(tipo_bairro_dormitorios);
    }
    for tipo_bairro_dormitorios in tipos_bairro_dormitorios {
        criterio_tipo_bairro_dormitorio.insert(tipo_bairro_dormitorios.to_string(), 0.0);
    }
    for item in data {
        let bairro = item.get("bairro");
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap().as_str();
        if bairro.is_none() {
            continue;
        }
        let bairro = bairro.unwrap();
        let dormitorios = item.get("dormitorios");
        if dormitorios.is_none() {
            continue;
        }
        let dormitorios = dormitorios.unwrap().as_f64().unwrap() as i32;
        let tipo = item.get("tipo");
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap().as_str();
        if tipo.is_none() {
            continue;
        }
        let tipo = tipo.unwrap();
        let tipo_bairro_dormitorios = format!("{}_{}_{}", tipo, bairro, dormitorios);
        let contador = criterio_tipo_bairro_dormitorio.get_mut(&tipo_bairro_dormitorios).unwrap();
        *contador += 1.0;
    }
    return criterio_tipo_bairro_dormitorio;
}
#[tauri::command]
fn get_mouse_position(wx: i32, wy: i32) -> String {
    let mouse = Mouse::new();
    let position = mouse.get_position().unwrap();
    let x = position.x - wx;
    let y = position.y - wy;
    return format!("{{\"x\": {}, \"y\": {}}}", x, y);
}
#[tauri::command]
fn get_config()->HashMap<String, Value>{
    let identifier = "com.tauri.imobiliariacasaalta";
    let config = config::Config::default();
    let path = app_local_data_dir(&config).unwrap();
    //como juntar o path com o identifier
    let path = path.join(identifier);
    let path = path.join("config.json");
    let path = path.to_str().unwrap();

    let config = std::fs::read_to_string(path);
    if config.is_err() {
        return HashMap::new();
    }
    let config = config.unwrap();
    let config: HashMap<String, Value> = serde_json::from_str(config.as_str()).unwrap();
    let config = config.get("config").unwrap().as_object().unwrap();
    let mut result_hashmap: HashMap<String, Value> = HashMap::new();
    for (key, value) in config {
        result_hashmap.insert(key.to_string(), value.clone());
    }


    return result_hashmap;


    


    

    
}
#[tauri::command]
fn classify(
    data: String,
    old_data: String,
    peso: String,
) -> Result<String, String>{


    let data_json: Result<Vec<HashMap<String, Value>>, serde_json::Error> =
        serde_json::from_str(data.as_str());
    if data_json.is_err() {
        return Err("Erro ao parsear os dados".to_string());
    }
    let data_json = data_json.unwrap();



    let old_data_json: Result<Vec<HashMap<String, Value>>, serde_json::Error> =
        serde_json::from_str(old_data.as_str());
    if old_data_json.is_err() {
        return Err("Erro ao parsear os dados antigos".to_string());
    }
    let old_data_json = old_data_json.unwrap();  
    let peso_obj = Peso::new_from_strignify(peso);
    let config = get_config();
    let mut result = Vec::<HashMap<String, Value>>::new();
    let criterios_bairros = get_criterio_bairro(&data_json);
    let criterios_bairros_tipo_imoveis = get_criterio_bairro_tipo_imovel(&data_json);
    let criterios_dormitorio_bairro = get_criterio_dormitorio_bairro(&data_json);
    let criterios_tipo_bairro_dormitorio = get_criterio_tipo_bairro_dormitorio(&data_json);
   


    for (_i, item) in data_json.iter().enumerate() {

        let referencia = item.get("referencia").ok_or("Referencia não encontrada".to_string())?;
        let default_tipo = Value::String("".to_string());
        let tipo = item.get("tipo").unwrap_or(&default_tipo).as_str().unwrap();
        let default_bairro = Value::String("".to_string());
        let bairro = item.get("bairro").unwrap_or(&default_bairro).as_str().unwrap();
        let dormitorios = item.get("dormitorios").unwrap_or(&Value::from(0)).as_f64().unwrap() as i32;
        let default_finalidade = Value::String("".to_string());
        let finalidade = item.get("finalidade").unwrap_or(&default_finalidade).as_str().unwrap();
        let locacao = item.get("locacao").unwrap_or(&Value::Number(serde_json::Number::from(0))).as_f64().unwrap() as f32;
        let venda = item.get("venda").unwrap_or(&Value::Number(serde_json::Number::from(0))).as_f64().unwrap() as f32;
        let tipo_do_anuncio = item.get("tipoDoAnuncio").unwrap_or(&Value::String("".to_string())).as_str().unwrap().to_string();
        let old_data = old_data_json.iter().find(|x| x.get("referencia").unwrap().as_str().unwrap() == item.get("referencia").unwrap().as_str().unwrap());
        let mut novo = old_data.is_none();
        let default_old_data = HashMap::new();
        let old_data = old_data.unwrap_or(&default_old_data);


        //valores que serao calculados com o peso para se fazer o ranking

        let venda_antigo;
        let locacao_antigo;

        if novo {
            venda_antigo = venda;
            locacao_antigo = locacao;           
        }
        else{
            venda_antigo = old_data.get("venda").unwrap().as_f64().unwrap() as f32;
            locacao_antigo = old_data.get("locacao").unwrap().as_f64().unwrap() as f32;
        }

        let variacao_venda = venda_antigo - venda;
        let variacao_locacao = locacao_antigo - locacao;
        let criacao = item.get("criacao").unwrap().as_str().unwrap();
        let max_novo = config.get("maxDiasNovo");
        if max_novo.is_none() {
            return Err("Erro ao obter o valor de maxDiasNovo".to_string());
        }
        let max_novo = max_novo.unwrap();
        let max_novo = max_novo.as_str().unwrap();       
        let max_novo = max_novo.parse::<i32>().unwrap();
        let criacao_date = NaiveDate::parse_from_str(criacao, "%d/%m/%Y");
        let criacao_date = match criacao_date {
            Ok(date) => date,
            Err(error) => return Err(error.to_string())
        };
        let recentemente_criado = criacao_date > chrono::Local::now().date_naive() - chrono::Duration::days(max_novo as i64);

        println!("{:?}",criacao_date);
        
        novo = novo || recentemente_criado;
        let venda_por_m2 = item.get("vendaPorM2")
            .unwrap_or(&Value::Number(serde_json::Number::from(0)))
            .as_f64().unwrap_or(0.0) as f32;
        let locacao_por_m2 = item.get("locacaoPorM2")
            .unwrap_or(&Value::Number(serde_json::Number::from(0)))
            .as_f64().unwrap_or(0.0) as f32;
        let visualizacoes = item.get("visualizacoes")
            .unwrap_or(&Value::Number(serde_json::Number::from(0)))
            .as_f64().unwrap_or(0.0) as f32;
        let contatos = item.get("contatos")
            .unwrap_or(&Value::Number(serde_json::Number::from(0)))
            .as_f64().unwrap_or(0.0) as f32;
        let num_visitas = item.get("numVisitas")
            .unwrap_or(&Value::Number(serde_json::Number::from(0)))
            .as_f64().unwrap_or(0.0) as f32;
        let criterio_bairro = criterios_bairros.get(bairro).unwrap();
        let criterio_tipo_bairro = criterios_bairros_tipo_imoveis.get(&format!("{}_{}", tipo, bairro)).unwrap();
        let criterio_dormitorio_bairro = criterios_dormitorio_bairro.get(&format!("{}_{}", dormitorios, bairro)).unwrap();
        let criterio_tipo_bairro_dormitorios = criterios_tipo_bairro_dormitorio.get(&format!("{}_{}_{}", tipo, bairro, dormitorios)).unwrap();
        
        
        
        let calculo_variacao_venda = peso_obj.diminuiu_preco * variacao_venda;
        let calculo_variacao_locacao = peso_obj.diminuiu_preco * variacao_locacao;
        let calculo_novo = match novo {
            true => peso_obj.novo,
            false => 0.0,
        };
        let calculo_venda_por_m2 = peso_obj.venda_por_m2 * venda_por_m2;
        let calculo_locacao_por_m2 = peso_obj.locacao_por_m2 * locacao_por_m2;
        let calculo_visualizacoes = peso_obj.visualizacoes * visualizacoes;
        let calculo_contatos = peso_obj.contatos * contatos;
        let calculo_visitas = peso_obj.visitas * num_visitas;
        let calculo_criterio_bairro = peso_obj.cont_bairro * criterio_bairro;
        let calculo_criterio_tipo_bairro = peso_obj.cont_tipo_bairro * criterio_tipo_bairro;
        let calculo_criterio_dormitorio_bairro = peso_obj.cont_dormitorio_bairro * criterio_dormitorio_bairro;
        let calculo_criterio_tipo_bairro_dormitorios = peso_obj.cont_tipo_bairro_dormitorio * criterio_tipo_bairro_dormitorios;
        let resultado = calculo_variacao_venda 
                            + calculo_variacao_locacao 
                            + calculo_novo 
                            + calculo_venda_por_m2 
                            + calculo_locacao_por_m2 
                            + calculo_visualizacoes 
                            + calculo_contatos 
                            + calculo_visitas 
                            + calculo_criterio_bairro 
                            + calculo_criterio_tipo_bairro 
                            + calculo_criterio_dormitorio_bairro 
                            + calculo_criterio_tipo_bairro_dormitorios;

        let mut result_item:HashMap<String,Value> = HashMap::new();
        result_item.insert("referencia".to_string(), Value::String(referencia.to_string()));
        result_item.insert("tipo".to_string(), Value::String(tipo.to_string()));
        result_item.insert("bairro".to_string(), Value::String(bairro.to_string()));
        result_item.insert("dormitorios".to_string(), Value::Number(serde_json::Number::from(dormitorios)));
        result_item.insert("finalidade".to_string(), Value::String(finalidade.to_string()));
        result_item.insert("tipoDoAnuncio".to_string(), Value::String(tipo_do_anuncio.to_string()));
        result_item.insert("novo".to_string(), Value::Bool(novo));
        result_item.insert("resultado".to_string(), Value::Number(serde_json::Number::from_f64(resultado as f64).unwrap()));

        result.push(result_item);




    }

    
    //ordene os dados por resultado
    result.sort_by(|a, b| {
        let a = a.get("resultado").unwrap().as_f64().unwrap();
        let b = b.get("resultado").unwrap().as_f64().unwrap();
        return b.partial_cmp(&a).unwrap();
    });

    //retorne os dados ordenados

    let res = serde_json::to_string(&result).unwrap();


    return Ok(res)




    
}
#[tauri::command]
fn compila_dados(data:String)->Vec<HashMap<String, f32>>{
    let data_json = serde_json::from_str(data.as_str()).unwrap();
    let mut result = Vec::<HashMap<String, f32>>::new();
    let criterio_bairro = get_criterio_bairro(&data_json);
    let criterio_bairro_tipo_imovel = get_criterio_bairro_tipo_imovel(&data_json);
    let criterio_dormitorio_bairro = get_criterio_dormitorio_bairro(&data_json);
    let criterio_tipo_bairro_dormitorio = get_criterio_tipo_bairro_dormitorio(&data_json);

    result.push(criterio_bairro);
    result.push(criterio_bairro_tipo_imovel);
    result.push(criterio_dormitorio_bairro);
    result.push(criterio_tipo_bairro_dormitorio);


    result

    
}
fn main() {
    
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_excel_to_hash_vector,
            read_sheet_to_hash_vector,
            get_sheets_names,
            get_mouse_position,
            save_xlsx,
            classify,
            compila_dados
    
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
