import { Router } from 'express';
import validateRequest from '../../middleware/validateRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyController } from './academicFaculty.controller';

const router = Router();

router.post(
  '/create-academic-faculty',
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
