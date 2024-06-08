import { Router } from 'express';
import { UserControllers } from './user.controller';
import validateRequest from '../../middleware/validateRequest';
import { createStudentValidationSchema } from '../student/student.zod.validation';
import { FacultyValidations } from '../Faculty/faculty.validation';
import { AdminValidations } from '../Admin/admin.validation';
const router = Router();

router.post(
  '/create-student',
  validateRequest(createStudentValidationSchema),
  UserControllers.handleCreateStudent,
);
router.post(
  '/create-faculty',
  validateRequest(FacultyValidations.createFacultyValidationSchema),
  UserControllers.handelCreateFaculty,
);

router.post("/create-admin",validateRequest(AdminValidations.createAdminValidationSchema),UserControllers.handelCreateAdmin)

export const UserRoutes = router;
