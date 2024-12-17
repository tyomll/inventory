import { Row } from "@tanstack/react-table";
import { mkConfig, generateCsv, download } from "export-to-csv";

const csvConfig = mkConfig({
  fieldSeparator: ",",
  filename: "products",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

export const exportExcel = (rows: Row<any>[]) => {
  const rowData = rows.map((row) => row.original);
  const csv = generateCsv(csvConfig)(rowData);
  download(csvConfig)(csv);
};
