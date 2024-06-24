import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";
import auth from "../../middleware/auth";

const router = Router()

router.post("/create-academic-department", auth("admin","superAdmin"), validateRequest(AcademicDepartmentValidations.createAcademicDepartmentValidationSchema),
AcademicDepartmentController.handleCreateAcademicDepartment)


router.get("/",AcademicDepartmentController.handleGetAllAcademicDepartment)
router.get("/:departmentId",AcademicDepartmentController.handleGetSingleAcademicDepartment)
router.patch("/:departmentId",AcademicDepartmentController.handleUpdateAcademicDepartment)

export const academicDepartmentRoutes = router