const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const app = express();
let cors = require("cors");
app.use(express.json());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//route to display directory contents
app.get("/", (req, res) => {
  let path = req.query.path;
  try {
    const files = fs.readdirSync("." + path);
    let result = [];
    files.forEach((file) => {
      if (fs.statSync("." + path + "/" + file).isDirectory()) {
        let data = {
          isDirectory: true,
          filepath: path + "/" + file,
          name: file,
        };
        result.push(data);
      } else {
        filedirectory = path.replace("/public", "");
        let data = {
          isDirectory: false,
          filepath: "http://localhost:5000" + filedirectory + "/" + file,
          name: file,
        };
        result.push(data);
      }
    });
    res.status(200).send({ message: "Success", files: result });
  } catch (e) {
    res.status(404).send({ message: "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
