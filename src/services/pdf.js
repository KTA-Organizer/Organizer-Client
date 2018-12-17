import * as pdfFonts from "pdfmake/build/vfs_fonts.js";
import * as pdfMake from "pdfmake/build/pdfmake.min.js";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getPDF = pdfData => {
  return pdfMake.createPdf(pdfData);
};

export const download = (pdfData, filename) => getPDF(pdfData).download(filename);
export const print = (pdfData, filename) => {
  const pdf = getPDF(pdfData);
  if (window.navigator.userAgent.indexOf("Edge") > -1) {
    // check if edge
    pdf.download(filename);
  } else {
    pdf.print();
  }
};
