<template>
  <div id="home">
    <div class="directory">
      <table class="table">
        <thead class="thead-dark">
          <tr class="text-left">
            <th>
              <h5>
                <i class="fa fa-home" aria-hidden="true" @click="reload"></i>
                Directory Content
              </h5>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-bind:key="file.path" v-for="file in files">
            <File
              v-bind:file="file"
              v-on:view-file="viewFile"
              v-on:view-directory="viewDirectory"
            />
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pdf"><PDFDocument v-bind:url="url" :scale="scale" /></div>
  </div>
</template>

<script>
import File from "./File.vue";
import PDFDocument from "./PDFDocument.vue";
import axios from "axios";

export default {
  name: "Home",
  components: {
    File,
    PDFDocument,
  },
  data() {
    return {
      url: null,
      scale: 1.8,
      files: [],
      folder: "/public",
    };
  },
  methods: {
    viewFile(filepath) {
      console.log(filepath);
      this.url = filepath;
    },
    viewDirectory(folder) {
      console.log(encodeURIComponent(folder));
      axios.get(`http://localhost:5000/?path=${folder}`).then((res) => {
        this.files = res.data.files;
      });
    },
    reload() {
      console.log("clicked");
      window.location.reload();
    },
  },
  mounted() {
    console.log(encodeURIComponent(this.folder));
    axios
      .get(`http://localhost:5000/?path=${this.folder}`)
      .then((res) => {
        this.files = res.data.files;
      })
      .catch((err) => {
        if (err.response.data) alert(err.response.data.message);
      });
  },
  created() {
    console.log("Created");
  },
};
</script>

<style>
#home {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  flex-wrap: wrap;
}
.directory {
  flex: 1;
  margin-left: 20px;
  max-width: 300px;
}
.directory th {
  border-radius: 2px;
  padding: 10px;
  margin-bottom: 2px;
  border-left: 2px solid #e6e7e8;
  color: #444;
  cursor: pointer;
  text-align: left;
}
.pdf {
  flex: 2;
  margin: 0;
}
</style>
