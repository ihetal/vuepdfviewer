<template>
  <td @click="onClick">
    {{ file.name }}
  </td>
</template>

<script>
export default {
  name: "File",
  props: ["file"],
  methods: {
    //Function to check whether it is a file or folder
    onClick() {
      if (this.file.isDirectory) {
        this.$emit("view-directory", this.file.filepath);
      } else {
        this.$emit("view-file", this.file.filepath);
      }
    },
  },
};
</script>

<style scoped>
td {
  border-radius: 2px;
  padding: 10px;
  background: #f4f4f4;
  margin-bottom: 2px;
  border-left: 2px solid #e6e7e8;
  color: #444;
  cursor: pointer;
  text-align: left;
}
</style>
