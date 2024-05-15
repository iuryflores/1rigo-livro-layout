import { Router } from "express";

import fs, { createWriteStream } from "fs";
import { promises as fsPromises } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pdfMake from "pdfmake/build/pdfmake.js";
import PdfPrinter from "pdfmake";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
router.get("/", async (req, res) => {
  const getType = (type) => {
    let newType = type;
    switch (type) {
      case "REGISTRO":
        newType = "Registrado";
        break;
      case "EXIGENCIA":
        newType = "Exigência";
        break;
      case "REINGRESSO":
        newType = "Reingressado";
        break;
      case "CANCELAMENTO":
        newType = "Cancelado";
        break;
      case "CADASTRO":
        newType = "Prenotado";
        break;
      default:
        newType = "";
        break;
    }
    return newType;
  };

  const filePath = path.join(__dirname, "../db", "seed-tratado.json");

  const data = await fsPromises.readFile(filePath, "utf-8");

  const jsonData = JSON.parse(data);

  const header = {
    columns: [
      { text: "Protocolo RI 1-GD", style: "headerText", width: "auto" },
      {
        text: "Registro de Imóveis da 1ª Circunscrição de Goiânia",
        style: "headerText",
        width: "*",
        alignment: "center",
      },
      {
        text: "03/10/2023",
        style: "headerText",
        width: "auto",
        alignment: "right",
      },
    ],
    margin: [60, 30, 40, 0],
    font: "Helvetica",
  };

  const headerLine = {
    table: {
      widths: ["*"],
      body: [[""]],
    },
    layout: {
      hLineWidth: function (i, node) {
        return i === 0 ? 0 : 2;
      },
      vLineWidth: function (i, node) {
        return 0;
      },
      hLineColor: function (i, node) {
        return i === 0 ? "white" : "#000";
      },
    },
    margin: [60, 0, 40, 0],
    fontSize: 9.75,
  };

  const formatNumber = (num) => {
    let numStr = num.toString();

    if (numStr.length >= 3) {
      let formattedNum =
        numStr.slice(0, numStr.length - 3) +
        "." +
        numStr.slice(numStr.length - 3);
      return formattedNum;
    } else {
      return numStr;
    }
  };

  const generatePdfContent = () => {
    const protocolos = jsonData
      .filter((protocolo) => protocolo.tipo === "CADASTRO")
      .map((protocolo) => formatNumber(protocolo.codigo))
      .join(", ");

    const totalCancelados = jsonData.filter(
      (item) => item.tipo === "CANCELAMENTO"
    ).length;
    const totalRegistrados = jsonData.filter(
      (item) => item.tipo === "REGISTRO"
    ).length;
    const totalExigencia = jsonData.filter(
      (item) => item.tipo === "EXIGENCIA"
    ).length;
    const totalReingressados = jsonData.filter(
      (item) => item.tipo === "REINGRESSO"
    ).length;
    const totalPrenotado = jsonData.filter(
      (item) => item.tipo === "CADASTRO"
    ).length;
    const content = [
      {
        layout: "lightHorizontalLines",
        table: {
          headerRows: 1,
          widths: ["7%", "10%", "36%", "19%", "21%", "8%"],
          body: [
            [
              { text: "Protocolo", style: "tableHeader" },
              { text: "Apresentação", style: "tableHeader" },
              { text: "Anotações", style: "tableHeader" },
              { text: "Natureza", style: "tableHeader" },
              { text: "Apresentante", style: "tableHeader" },
              { text: "Ocorrência", style: "tableHeader" },
            ],
            ...jsonData.map((item) => [
              { text: formatNumber(item.codigo), style: "tableCellMaior" },
              { text: item.cadastro, style: "tableCellMaior" },
              { text: item.anotacao, style: "tableCellMaior" },
              { text: item.natureza, style: "tableCellMenor" },
              {
                text: item.solicitante.toUpperCase(),
                style: "tableCellMaior",
              },
              { text: getType(item.tipo), style: "tableCellMenor" },
            ]),
          ],
        },
        // layout: {
        //   paddingTop: function (i, node) {
        //     return i === 0 && node.pageBreakBefore ? 20 : 0;
        //   },
        // },
        styles: {},
      },
      {
        columns: [
          {
            text: `Certifico haver encerrado o expediente, tendo protocolado ${totalPrenotado} títulos sob os n.s ${protocolos}.`,
            fontSize: 9.5,
            alignment: "justify",
            margin: [0, 10, 0, 10],
            lineHeight: 1.4,
            font: "Helvetica",
          },
        ],
      },

      {
        columns: [
          {
            width: "70%",
            fontSize: 9.5,
            table: {
              headerRows: 1,
              widths: ["25%", "75%"],
              body: [
                [
                  {
                    text: "Termo de encerramento",
                    bold: true,
                    alignment: "left",
                    margin: [0, 60, 0, 0],
                  },

                  {
                    text: "__________________________________________",
                    alignment: "left",
                    margin: [0, 60, 0, 0],
                  },
                ],
                [
                  { text: " " },
                  {
                    text: "O Oficial/Substituto/Escrevente Autorizado",
                    alignment: "left",
                  },
                ],
                [
                  { text: " " },
                  {
                    text: "Goiânia, 03/10/2023",
                    margin: [0, 0, 0, 5],
                    alignment: "left",
                  },
                ],
              ],
            },
            layout: "noBorders",
            alignment: "right",
            style: {
              fontSize: 9,
              font: "Helvetica",
              lineHeight: 1.4,
              margin: [0, 50, 50, 0],
            },
          },
          {
            width: "30%",
            fontSize: 9.5,
            bold: true,
            table: {
              widths: ["auto", "*"],
              body: [
                [
                  {
                    text: "Cancelados:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: totalCancelados, margin: [0, 4, 0, 4] },
                ],
                [
                  {
                    text: "Exigência:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: totalExigencia, margin: [0, 4, 0, 4] },
                ],
                [
                  {
                    text: "Prenotado:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: totalPrenotado, margin: [0, 4, 0, 4] },
                ],
                [
                  {
                    text: "Registrado:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: totalRegistrados, margin: [0, 4, 0, 4] },
                ],
                [
                  {
                    text: "Reingressados:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: totalReingressados, margin: [0, 4, 0, 4] },
                ],
                [
                  {
                    text: "Total de Ocorrências:",
                    alignment: "left",
                    margin: [0, 4, 0, 4],
                  },
                  { text: jsonData.length, margin: [0, 4, 0, 4] },
                ],
              ],
            },
            layout: {
              hLineWidth: function (i, node) {
                return i === 0 ? 0 : 1;
              },
              vLineWidth: function (i, node) {
                return 0;
              },
              hLineColor: function (i, node) {
                return i === 0 ? "white" : "#000";
              },
            },
            alignment: "right",
            style: {
              fontSize: 9,
              font: "Helvetica",
              lineHeight: 1.2,
            },
          },
        ],
        columnGap: 20, // Ajusta a distância entre as colunas se necessário
      },
    ];

    return content;
  };

  const docDefinition = {
    defaultStyle: { font: "Times" },
    pageSize: "A4",
    pageMargins: [60, 60, 50, 50],
    pageOrientation: "landscape",
    header: function (currentPage, pageCount, pageSize) {
      if (currentPage === 1) {
        return {
          stack: [header, headerLine],
        };
      } else {
        return {
          stack: [header, headerLine],
          padding: 40,
        };
      }
    },
    footer: (currentPage, pageCount) => {
      let footerText = "";
      if (currentPage >= 1) {
        const folha =
          currentPage % 2 === 0
            ? currentPage / 2 + 47
            : (currentPage + 1) / 2 + 47;
        const lado = currentPage % 2 === 1 ? "F" : "V";
        footerText = `Folha ${folha}${lado}`;
      }
      return {
        text: footerText,
        style: "footer",
        alignment: "center",
      };
    },
    content: generatePdfContent(),
    // pageBreakBefore: function (
    //   currentNode,
    //   followingNodesOnPage,
    //   nodesOnNextPage,
    //   previousNodesOnPage
    // ) {
    //   // Se o nó atual é uma linha de tabela e é a primeira da página
    //   if (currentNode.type === "table" && currentNode.pageBreakBefore) {
    //     return true;
    //   }

    //   // Se o nó atual é uma linha de tabela e a página anterior não é uma linha de tabela completa
    //   if (currentNode.table && currentNode.startPosition.top > 0) {
    //     if (previousNodesOnPage.length > 0) {
    //       var prevNode = previousNodesOnPage[previousNodesOnPage.length - 1];
    //       if (prevNode.table && prevNode.pageBreakBefore) {
    //         return true;
    //       }
    //     }
    //   }

    //   return false;
    // },
    styles: {
      page: {
        flexDirection: "row",
        backgroundColor: "#fff",
      },
      headerText: {
        fontSize: 12,
        margin: [0, 3, 0, 0],
        bold: "Helvetica-Bold",
      },
      footer: {
        fontSize: 11,
        alignment: "center",
        margin: [0, 10, 0, 0],
        font: "Helvetica",
      },

      tableCellMaior: {
        margin: [0, 4, 0, 2.5],
        lineHeight: 1.12,
        fontSize: 9.2,
      },
      tableCellMenor: {
        margin: [0, 4, 0, 2.5],
        lineHeight: 1.12,
        fontSize: 9.2,
      },
      tableHeader: {
        bold: true,
        fontSize: 9.75,
        alignment: "left",
        font: "Helvetica",
        margin: [0, 2],
      },
    },
  };

  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
    Times: {
      normal: "Times-Roman",
      bold: "Times-Bold",
      italics: "Times-Italic",
      bolditalics: "Times-BoldItalic",
    },
    Symbol: {
      normal: "Symbol",
    },
    ZapfDingbats: {
      normal: "ZapfDingbats",
    },
  };

  const printer = new PdfPrinter(fonts);

  // Crie um documento PDF usando PdfPrinter
  const pdfDoc = printer.createPdfKitDocument(docDefinition);

  //   pdfDoc.pipe(fs.createWriteStream("Relatorio.pdf"));
  const outputStream = createWriteStream("output.pdf");

  // Pipe o PDF para o stream de escrita
  pdfDoc.pipe(outputStream);

  // Finalize o PDF
  pdfDoc.end();

  // Lidar com eventos de conclusão e erro
  outputStream.on("finish", () => {
    console.log("PDF gerado com sucesso!");
  });

  outputStream.on("error", (err) => {
    console.error("Erro ao gerar o PDF:", err);
  });

  console.log("Working!");
  try {
    return res.status(200).json({ msg: "Working!" });
  } catch (error) {
    return res.status(500).json({ msg: "Ocorreu um erro!" });
  }
});

export default router;
