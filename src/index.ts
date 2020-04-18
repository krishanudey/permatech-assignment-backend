import express from "express";
import { AcMode } from "./service/device-helper";
import bodyParser from "body-parser";
import { devicesRouter } from "./routes/devices-router";
const app = express();
const port = process.env.PORT || 8080;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use("/api/v1/devices", devicesRouter);

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
