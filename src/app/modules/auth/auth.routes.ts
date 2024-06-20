import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.vavlidation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";

const router = Router()


router.post("/login",validateRequest(AuthValidation.loginValidationSchema),AuthControllers.handleLoginUser)

router.post('/change-password',auth(),AuthControllers.handleChangePassword)

router.get("/")




export const AuthRoutes = router