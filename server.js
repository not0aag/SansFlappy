const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "landing.html"));
});

app.use(express.static("public"));
app.use("/images", express.static(path.join(__dirname, "Images")));

app.get("/api/gameData", (req, res) => {
    res.json(require('./gameData.json'));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
