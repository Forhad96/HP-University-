import { Router } from "express";
import validateRequest from "../../middleware/validateRequest";
import { AcademicDepartmentValidations } from "./academicDepartment.validation";
import { AcademicDepartmentController } from "./academicDepartment.controller";

const router = Router()

router.post("/create-academic-department",
AcademicDepartmentController.handleCreateAcademicDepartment)


router.get("/",AcademicDepartmentController.handleGetAllAcademicDepartment)
router.get("/:departmentId",AcademicDepartmentController.handleGetSingleAcademicDepartment)
router.patch("/:departmentId",AcademicDepartmentController.handleUpdateAcademicDepartment)

export const academicDepartmentRoutes = router