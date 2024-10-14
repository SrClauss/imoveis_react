import { Button } from "@mui/material";
import { invoke, dialog } from "@tauri-apps/api";

export default function ButtonExcel({
  withArchive,
  fileName,
  description,
  id,
  onSendData,
  onSendFileName,
}) {
  const handleFileChange = () => {
    dialog
      .open(
        {
          multiple: false,
          directory: false,
          filters: [{ name: "Planilha Excel", extensions: ["xlsx", "xls"] }],
         

        }
      )
      .then((result) => {
        invoke("get_sheets_names", { dir: result })
          .then((response) => {
            if (response) {
              if (response.includes(id)) {
                console.log(id);
                invoke("read_sheet_to_hash_vector", {
                  path: result,
                  sheetName: id,
                })
                  .then((response) => {
                    onSendFileName(result);
                    onSendData(JSON.parse(response));
                  })
                  .catch((e) => {
                    console.error(e);
                  });
              } else {
                dialog.message("Planilha não encontrada", {
                  title: "Erro",
                  type: "error",  })
              }
            }
          })
          .catch((e) => {
            console.error(e);
          });
      });
  };

  return (
    <div className="w-96 flex flex-col justify-center p-2">
      <div className="text-center">{description}</div>

      <Button variant="contained" color="inherit" onClick={handleFileChange}>
        {withArchive ? (
          <div>
            <img src="img/archive.png" alt="Arquivo" width={100} />
          </div>
        ) : (
          <div>
            <img src="img/no_archive.png" alt="Excel" width={100} />
          </div>
        )}
      </Button>

      <div className="text-center text-xs p-2 h-5">{fileName}</div>
    </div>
  );
}
