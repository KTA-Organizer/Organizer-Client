<template>
<v-dialog v-model="model" content-class="pdf-dialogje">
    <iframe id="pdf-viewer">
    </iframe>
</v-dialog>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake.min.js";

export default {
    name: "PDFDialog",
    props: ["model", "reportid"],
    methods: {
      async updatePdf(reportid) {
        const iframe = document.getElementById("pdf-viewer");
        const pdfData = await this.$http.getReportPDF(reportid);
        const pdfDocGenerator = pdfMake.createPdf(pdfData);
        pdfDocGenerator.getDataUrl((dataUrl) => {
          iframe.src = dataUrl;
        });
      }
    },
    watch: {
      reportid: function(newReportid) {
        if (newReportid < 1) return;
        this.updatePdf(newReportid);
      }
    },
}
</script>

<style>
.pdf-dialogje {
  height: 100%;
}
.pdf-dialogje iframe {
  height: 100%;
  width: 100%;
}
</style>
