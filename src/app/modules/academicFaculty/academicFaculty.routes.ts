import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';
import auth from '../../middleware/auth';
import { USER_ROLES } from '../user/user.constant';

const router = Router();

router.post(
  '/create-academic-faculty',
  auth(USER_ROLES.superAdmin,USER_ROLES.admin),
  validateRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleCreateAcademicFaculty,
);

router.get('/', AcademicFacultyController.handleGetAllAcademicFaculties);

router.get(
  '/:facultyId',
  AcademicFacultyController.handleGetSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  validateRequest(
    AcademicFacultyValidation.updateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleUpdateSingleAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
