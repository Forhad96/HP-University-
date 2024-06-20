import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AuthValidation } from "./auth.vavlidation";
import { AuthControllers } from "./auth.controller";
import auth from "../../middleware/auth";
import { USER_ROLES } from "../user/user.constant";

const router = Router()


router.post("/login",validateRequest(AuthValidation.loginValidationSchema),AuthControllers.handleLoginUser)

router.post('/change-password',auth(USER_ROLES.admin,USER_ROLES.student,USER_ROLES.faculty) ,validateRequest(AuthValidation.changePasswordValidationSchema),AuthControllers.handleChangePassword)

router.get("/")




export const AuthRoutes = router