import express from "express";

import { checkAuthController, logoutController, signinController, signupController, updateProfileController } from "../controller/auth.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router = express.Router();


router.post("/signup", signupController );
router.post("/signin",signinController );
router.post("/signout", logoutController );


router.put("/update-profile", protectRoute, updateProfileController);

router.get("/check", protectRoute, checkAuthController);



export default router;