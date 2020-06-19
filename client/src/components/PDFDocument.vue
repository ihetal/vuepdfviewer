<template>
  <div class="pdf-document">
    <div style="padding-top:10px">
      <button type="button" class="btn btn-light mr-3" @click="prevPage">
        Previous
      </button>
      <button type="button" class="btn btn-light mr-3" @click="nextPage">
        Next
      </button>
      <button type="button" class="btn btn-dark mr-2" @click="zoomOut">
        Zoom Out
      </button>
      <button type="button" class="btn btn-dark mr-2" @click="zoomIn">
        Zoom In
      </button>
      &nbsp; &nbsp;
      <span v-if="url"
        >Page: <span id="page_num">{{ this.pagenum }}</span> /
        <span id="page_count">{{ this.totalpages }}</span></span
      >
    </div>
    <div>
      <PDFPage
        v-for="page in pages"
        v-bind="{ scale }"
        :key="page.pageNumber"
        :page="page"
      />
    </div>
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
  props: ["url"],
  data() {
    return {
      pdf: undefined,
      pages: [],
      totalpages: 0,
      pagenum: 1,
      scale: 1.8,
    };
  },
  watch: {
    pdf: {
      handler(pdf) {
        this.pages = [];
        this.scale = 2;
        this.pagenum = 1;
        this.totalpages = pdf.numPages;
        const promises = range(this.pagenum, this.pagenum + 1).map((number) =>
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
    nextPage() {
      if (this.pagenum >= this.totalpages) {
        return;
      }
      this.pagenum++;
      this.setPage();
    },
    prevPage() {
      if (this.pagenum <= 1) {
        return;
      }
      this.pagenum--;
      this.setPage();
    },
    setPage() {
      const promises = range(this.pagenum, this.pagenum + 1).map((number) =>
        this.pdf.getPage(number)
      );
      return Promise.all(promises)
        .then((pages) => (this.pages = pages))
        .then(() => console.log("pages fetched"));
    },
    zoomIn() {
      if (this.scale >= 2.2) {
        return;
      }
      this.scale = this.scale + 0.2;
    },
    zoomOut() {
      if (this.scale <= 1.4) {
        return;
      }
      this.scale = this.scale - 0.2;
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
  background: #8e9091;
  margin-left: 20px;
}
</style>
