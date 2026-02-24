import express from "express";
import * as authCtrl from "./controllers/auth.controller.js";
import * as credCtrl from "./controllers/credentials.controller.js";
import authenticate from "./middleware/authenticate.js";

const router = express.Router();

router.post("/auth/register", authCtrl.register);
router.post("/auth/login", authCtrl.login);

router.get("/credentials", authenticate, credCtrl.listCredentials);
router.post("/credentials", authenticate, credCtrl.createCredential);
router.get("/credentials/:id", authenticate, credCtrl.getCredential);
router.post("/credentials/:id/reveal", authenticate, credCtrl.revealPassword);
router.put("/credentials/:id", authenticate, credCtrl.updateCredential);
router.patch("/credentials/:id", authenticate, credCtrl.updateCredential);
router.delete("/credentials/:id", authenticate, credCtrl.deleteCredential);

export default router;
