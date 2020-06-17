<template>
  <div class="pdf-document">
    <PDFPage
      v-for="page in pages"
      v-bind="{ scale }"
      :key="page.pageNumber"
      :page="page"
    />
  </div>
</template>

<script>
// PDFDocument renders an entire PDF inline using
// PDF.js and <canvas>.
import debug from "debug";

const log = debug("app:components/PDFDocument");
import PDFPage from "./PDFPage";
import range from "lodash/range";
import pdfjs from "pdfjs-dist/build/pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.4.456/pdf.worker.js`;
export default {
  components: {
    PDFPage,
  },
  props: ["url", "scale"],
  data() {
    return {
      pdf: undefined,
      pages: [],
    };
  },
  watch: {
    pdf: {
      handler(pdf) {
        this.pages = [];

        const promises = range(1, pdf.numPages + 1).map((number) =>
          pdf.getPage(number)
        );
        return Promise.all(promises)
          .then((pages) => (this.pages = pages))
          .then(() => log("pages fetched"));
      },
    },
    url(url) {
      this.fetchPDF();
      console.log(url);
    },
  },
  methods: {
    async fetchPDF() {
      this.pdf = await pdfjs.getDocument(this.url).promise;
    },
  },
  mounted() {
    this.fetchPDF();
  },
};
</script>
<style>
.pdf-document {
  overflow: scroll;
  width: 1000px;
  height: 100vh;
  background: #5c5858;
  margin-left: 20px;
}
</style>
