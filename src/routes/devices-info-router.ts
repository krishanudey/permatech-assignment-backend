import * as express from "express";
import * as controller from "../controller/devices-info-controller";

const router = express.Router();

router.get("/discover", controller.discoverDevicesOnNetwork);
router.get("/", controller.getAllDevicesFromDb);
router.get("/:uuid", controller.getDeviceByUuidFromDb);
router.post("/", controller.addDeviceToDb);
router.delete("/:uuid", controller.removeDeviceFromDb);
router.put("/:uuid", controller.updateDeviceInDb);

export const devicesRouter = router;
