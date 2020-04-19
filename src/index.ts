import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { devicesRouter } from "./routes/devices-info-router";
import { actionsRouter } from "./routes/device-action-router";
const app = express();
const port = process.env.PORT || 8080;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use("/api/v1/devices", devicesRouter);
app.use("/api/v1/actions", actionsRouter);

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});
