import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { FacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';



const router = Router();

router.post(
  '/create-academic-faculty',
  validateRequest(
    FacultyValidation.UpdateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleCreateAcademicFaculty,
);

router.get('/', AcademicFacultyController.handleGetAllAcademicFaculties);

router.get(
  '/:semesterId',
  AcademicFacultyController.handleGetSingleAcademicFaculty,
);

router.patch(
  '/:semesterId',
  validateRequest(
    FacultyValidation.UpdateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyController.handleUpdateSingleAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
