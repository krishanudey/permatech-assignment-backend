import * as express from "express";
import * as controller from "../controller/device-action-controller";

const router = express.Router();

router.get("/get-status/:uuid", controller.getStatus);
router.post("/perform/:uuid", controller.performAction);

export const actionsRouter = router;
